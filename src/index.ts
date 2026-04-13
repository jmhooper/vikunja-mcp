import express, { Request, Response, NextFunction } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { VikunjaClient } from "./vikunja/client.js";
import { createMcpServer } from "./server.js";
import logger from "./logger.js";

const PORT = process.env.PORT ?? "3000";
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const VIKUNJA_BASE_URL = process.env.VIKUNJA_BASE_URL;
const VIKUNJA_API_TOKEN = process.env.VIKUNJA_API_TOKEN;

if (!MCP_AUTH_TOKEN) throw new Error("MCP_AUTH_TOKEN is required");
if (!VIKUNJA_BASE_URL) throw new Error("VIKUNJA_BASE_URL is required");
if (!VIKUNJA_API_TOKEN) throw new Error("VIKUNJA_API_TOKEN is required");

const vikunjaClient = new VikunjaClient(VIKUNJA_BASE_URL, VIKUNJA_API_TOKEN);

const app = express();
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info("incoming request", { method: req.method, path: req.path });
  next();
});

function requireBearerToken(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    logger.warn("rejected request: missing authorization header", {
      ip: req.ip,
    });
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  const token = header.slice(7);
  if (token !== MCP_AUTH_TOKEN) {
    logger.warn("rejected request: invalid token", { ip: req.ip });
    res.status(403).json({ error: "Invalid token" });
    return;
  }
  next();
}

app.post("/mcp", requireBearerToken, async (req: Request, res: Response) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    const server = createMcpServer(vikunjaClient);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    logger.error("MCP request failed", { err });
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(Number(PORT), () => {
  logger.info("vikunja-mcp listening", { port: PORT });
});

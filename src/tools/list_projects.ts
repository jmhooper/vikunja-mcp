import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VikunjaClient } from "../vikunja/client.js";
import { listProjects } from "../vikunja/projects.js";

export function registerListProjects(server: McpServer, client: VikunjaClient): void {
  server.tool("list_projects", "List all Vikunja projects", {}, async () => {
    const projects = await listProjects(client);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(projects, null, 2),
        },
      ],
    };
  });
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VikunjaClient } from "./vikunja/client.js";
import { registerListProjects } from "./tools/list_projects.js";
import { registerGetTasks } from "./tools/get_tasks.js";
import { registerCreateTask } from "./tools/create_task.js";
import { registerUpdateTask } from "./tools/update_task.js";

export function createMcpServer(client: VikunjaClient): McpServer {
  const server = new McpServer({
    name: "vikunja-mcp",
    version: "0.1.0",
  });

  registerListProjects(server, client);
  registerGetTasks(server, client);
  registerCreateTask(server, client);
  registerUpdateTask(server, client);

  return server;
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { VikunjaClient } from "../vikunja/client.js";
import { getTasks } from "../vikunja/tasks.js";

export function registerGetTasks(server: McpServer, client: VikunjaClient): void {
  server.tool(
    "get_tasks",
    "Get tasks from Vikunja, optionally filtered by project",
    {
      project_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filter tasks to a specific project ID"),
      include_done: z
        .boolean()
        .optional()
        .default(false)
        .describe("Include completed tasks (default: false)"),
    },
    async ({ project_id, include_done }) => {
      const tasks = await getTasks(client, {
        projectId: project_id,
        includeDone: include_done,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(tasks, null, 2),
          },
        ],
      };
    }
  );
}

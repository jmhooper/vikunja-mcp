import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { VikunjaClient } from "../vikunja/client.js";
import { updateTask } from "../vikunja/tasks.js";

export function registerUpdateTask(server: McpServer, client: VikunjaClient): void {
  server.tool(
    "update_task",
    "Update an existing Vikunja task",
    {
      id: z.number().int().positive().describe("The ID of the task to update"),
      project_id: z.number().int().positive().describe("The project the task belongs to"),
      title: z.string().describe("Task title"),
      description: z.string().describe("Task description"),
      done: z.boolean().optional().describe("Whether the task is completed"),
      due_date: z
        .string()
        .optional()
        .describe("Due date in RFC3339 format (e.g. 2026-04-20T00:00:00Z)"),
    },
    async ({ id, project_id, title, description, done, due_date }) => {
      const task = await updateTask(client, id, {
        project_id,
        title,
        description,
        done,
        due_date,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );
}

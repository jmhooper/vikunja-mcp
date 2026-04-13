import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { VikunjaClient } from "../vikunja/client.js";
import { createTask } from "../vikunja/tasks.js";

export function registerCreateTask(server: McpServer, client: VikunjaClient): void {
  server.tool(
    "create_task",
    "Create a new task in a Vikunja project",
    {
      project_id: z
        .number()
        .int()
        .positive()
        .describe("The project to create the task in"),
      title: z.string().describe("Task title"),
      description: z.string().describe("Task description"),
      done: z.boolean().optional().describe("Whether the task is completed"),
      due_date: z
        .string()
        .optional()
        .describe("Due date in RFC3339 format (e.g. 2026-04-20T00:00:00Z)"),
    },
    async ({ project_id, title, description, done, due_date }) => {
      const task = await createTask(client, {
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

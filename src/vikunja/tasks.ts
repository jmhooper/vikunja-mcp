import { VikunjaClient } from "./client.js";
import { buildFilter } from "./filters.js";

export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  due_date: string | null;
  priority: number;
  project_id: number;
  labels: Array<{ id: number; title: string }>;
  assignees: Array<{ id: number; name: string; username: string }>;
  created: string;
  updated: string;
}

export interface GetTasksOptions {
  projectId?: number;
  includeDone?: boolean;
}

export interface CreateTaskInput {
  project_id: number;
  title: string;
  description: string;
  done?: boolean;
  due_date?: string;
}

export interface UpdateTaskInput {
  project_id: number;
  title: string;
  description: string;
  done?: boolean;
  due_date?: string;
}

export async function getTasks(
  client: VikunjaClient,
  options: GetTasksOptions = {}
): Promise<Task[]> {
  const { projectId, includeDone = false } = options;

  const conditions = [];
  if (!includeDone) {
    conditions.push({ field: "done", op: "=", value: false });
  }
  const query = buildFilter(conditions);

  if (projectId !== undefined) {
    return client.request<Task[]>(`/projects/${projectId}/tasks${query}`);
  }

  return client.request<Task[]>(`/tasks${query}`);
}

export async function createTask(
  client: VikunjaClient,
  input: CreateTaskInput
): Promise<Task> {
  const { project_id, ...body } = input;
  return client.request<Task>(`/projects/${project_id}/tasks`, {
    method: "PUT",
    body,
  });
}

export async function updateTask(
  client: VikunjaClient,
  taskId: number,
  input: UpdateTaskInput
): Promise<Task> {
  return client.request<Task>(`/tasks/${taskId}`, {
    method: "POST",
    body: input,
  });
}

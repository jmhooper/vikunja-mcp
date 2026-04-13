import { VikunjaClient } from "./client.js";

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

export async function getTasks(
  client: VikunjaClient,
  options: GetTasksOptions = {}
): Promise<Task[]> {
  const { projectId, includeDone = false } = options;

  const params = new URLSearchParams();
  if (!includeDone) {
    params.set("filter", "done = false");
  }
  const query = params.toString() ? `?${params}` : "";

  if (projectId !== undefined) {
    return client.request<Task[]>(`/projects/${projectId}/tasks${query}`);
  }

  return client.request<Task[]>(`/tasks/all${query}`);
}

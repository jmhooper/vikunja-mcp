import { VikunjaClient } from "./client.js";
import { buildFilter } from "./filters.js";

export interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  done_at: string | null;
  due_date: string | null;
  project_id: number;
  bucket_id: number;
  labels: Array<{ id: number; title: string }>;
  created_by: { id: number; name: string; username: string };
  created: string;
  updated: string;
}

function pickTask(raw: Record<string, unknown>): Task {
  return {
    id: raw.id as number,
    title: raw.title as string,
    description: raw.description as string,
    done: raw.done as boolean,
    done_at: raw.done_at as string | null,
    due_date: raw.due_date as string | null,
    project_id: raw.project_id as number,
    bucket_id: raw.bucket_id as number,
    labels: raw.labels as Task["labels"],
    created_by: raw.created_by as Task["created_by"],
    created: raw.created as string,
    updated: raw.updated as string,
  };
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

  const path =
    projectId !== undefined ? `/projects/${projectId}/tasks${query}` : `/tasks${query}`;
  const raw = await client.request<Record<string, unknown>[]>(path);

  return raw.map(pickTask);
}

export async function createTask(
  client: VikunjaClient,
  input: CreateTaskInput
): Promise<Task> {
  const { project_id, ...body } = input;
  const raw = await client.request<Record<string, unknown>>(`/projects/${project_id}/tasks`, {
    method: "PUT",
    body,
  });
  return pickTask(raw);
}

export async function updateTask(
  client: VikunjaClient,
  taskId: number,
  input: UpdateTaskInput
): Promise<Task> {
  const raw = await client.request<Record<string, unknown>>(`/tasks/${taskId}`, {
    method: "POST",
    body: input,
  });
  return pickTask(raw);
}

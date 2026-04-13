import { VikunjaClient } from "./client.js";

export interface Project {
  id: number;
  title: string;
  description: string;
  is_archived: boolean;
}

export async function listProjects(client: VikunjaClient): Promise<Project[]> {
  return client.request<Project[]>("/projects");
}

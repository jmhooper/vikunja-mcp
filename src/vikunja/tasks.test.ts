import { jest } from "@jest/globals";
import { getTasks } from "./tasks.js";
import { createMockClient } from "./client.mock.js";

jest.mock("../logger.js");

const mockTasks = [
  { id: 1, title: "Buy milk", done: false, project_id: 1 },
  { id: 2, title: "Write tests", done: false, project_id: 2 },
];

describe("getTasks", () => {
  describe("without a project filter", () => {
    it("calls /tasks/all", async () => {
      const client = createMockClient({ "/tasks/all": mockTasks });
      await getTasks(client);
      expect(client.request).toHaveBeenCalledWith(expect.stringContaining("/tasks/all"));
    });

    it("excludes done tasks by default", async () => {
      const client = createMockClient({ "/tasks/all": mockTasks });
      await getTasks(client);
      expect(client.request).toHaveBeenCalledWith(expect.stringContaining("filter="));
    });

    it("omits the filter when includeDone is true", async () => {
      const client = createMockClient({ "/tasks/all": mockTasks });
      await getTasks(client, { includeDone: true });
      expect(client.request).toHaveBeenCalledWith("/tasks/all");
    });
  });

  describe("with a project filter", () => {
    it("calls /projects/:id/tasks", async () => {
      const client = createMockClient({ "/projects/42/tasks": mockTasks });
      await getTasks(client, { projectId: 42 });
      expect(client.request).toHaveBeenCalledWith(expect.stringContaining("/projects/42/tasks"));
    });

    it("excludes done tasks by default", async () => {
      const client = createMockClient({ "/projects/42/tasks": mockTasks });
      await getTasks(client, { projectId: 42 });
      expect(client.request).toHaveBeenCalledWith(expect.stringContaining("filter="));
    });

    it("omits the filter when includeDone is true", async () => {
      const client = createMockClient({ "/projects/42/tasks": mockTasks });
      await getTasks(client, { projectId: 42, includeDone: true });
      expect(client.request).toHaveBeenCalledWith("/projects/42/tasks");
    });
  });

  it("returns the tasks from the client", async () => {
    const client = createMockClient({ "/tasks/all": mockTasks });
    const result = await getTasks(client);
    expect(result).toEqual(mockTasks);
  });
});

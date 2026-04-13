import { jest } from "@jest/globals";
import { getTasks, createTask, updateTask } from "./tasks.js";
import { createMockClient } from "./client.mock.js";

jest.mock("../logger.js");

const mockTasks = [
  { id: 1, title: "Buy milk", done: false, project_id: 1 },
  { id: 2, title: "Write tests", done: false, project_id: 2 },
];

describe("getTasks", () => {
  describe("without a project filter", () => {
    it("calls /tasks", async () => {
      const client = createMockClient({ "/tasks": mockTasks });
      await getTasks(client);
      expect(client.request).toHaveBeenCalledWith(expect.stringContaining("/tasks"));
    });

    it("excludes done tasks by default", async () => {
      const client = createMockClient({ "/tasks": mockTasks });
      await getTasks(client);
      expect(client.request).toHaveBeenCalledWith(expect.stringContaining("filter="));
    });

    it("omits the filter when includeDone is true", async () => {
      const client = createMockClient({ "/tasks": mockTasks });
      await getTasks(client, { includeDone: true });
      expect(client.request).toHaveBeenCalledWith("/tasks");
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
    const client = createMockClient({ "/tasks": mockTasks });
    const result = await getTasks(client);
    expect(result).toEqual(mockTasks);
  });
});

const mockTask = { id: 7, title: "New task", description: "Details", done: false, project_id: 42 };

describe("createTask", () => {
  it("calls PUT /projects/:id/tasks", async () => {
    const client = createMockClient({ "/projects/42/tasks": mockTask });
    await createTask(client, { project_id: 42, title: "New task", description: "Details" });
    expect(client.request).toHaveBeenCalledWith(
      "/projects/42/tasks",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("sends title and description in the body", async () => {
    const client = createMockClient({ "/projects/42/tasks": mockTask });
    await createTask(client, { project_id: 42, title: "New task", description: "Details" });
    expect(client.request).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: expect.objectContaining({ title: "New task", description: "Details" }) })
    );
  });

  it("does not send project_id in the body", async () => {
    const client = createMockClient({ "/projects/42/tasks": mockTask });
    await createTask(client, { project_id: 42, title: "New task", description: "Details" });
    expect(client.request).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: expect.not.objectContaining({ project_id: expect.anything() }) })
    );
  });

  it("returns the created task", async () => {
    const client = createMockClient({ "/projects/42/tasks": mockTask });
    const result = await createTask(client, { project_id: 42, title: "New task", description: "Details" });
    expect(result).toEqual(mockTask);
  });
});

describe("updateTask", () => {
  it("calls POST /tasks/:id", async () => {
    const client = createMockClient({ "/tasks/7": mockTask });
    await updateTask(client, 7, { project_id: 42, title: "New task", description: "Details" });
    expect(client.request).toHaveBeenCalledWith(
      "/tasks/7",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends all fields in the body", async () => {
    const client = createMockClient({ "/tasks/7": mockTask });
    await updateTask(client, 7, { project_id: 42, title: "New task", description: "Details", done: true });
    expect(client.request).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.objectContaining({ project_id: 42, title: "New task", description: "Details", done: true }),
      })
    );
  });

  it("returns the updated task", async () => {
    const client = createMockClient({ "/tasks/7": mockTask });
    const result = await updateTask(client, 7, { project_id: 42, title: "New task", description: "Details" });
    expect(result).toEqual(mockTask);
  });
});

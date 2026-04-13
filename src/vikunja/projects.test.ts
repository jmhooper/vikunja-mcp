import { jest } from "@jest/globals";
import { listProjects } from "./projects.js";
import { createMockClient } from "./client.mock.js";

jest.mock("../logger.js");

const mockProjects = [
  { id: 1, title: "Inbox", description: "", is_archived: false },
  { id: 2, title: "Work", description: "", is_archived: false },
];

describe("listProjects", () => {
  it("calls /projects and returns the result", async () => {
    const client = createMockClient({ "/projects": mockProjects });

    const result = await listProjects(client);

    expect(client.request).toHaveBeenCalledWith("/projects");
    expect(result).toEqual(mockProjects);
  });
});

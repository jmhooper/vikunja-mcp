import { jest } from "@jest/globals";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { VikunjaClient } from "./client.js";

jest.mock("../logger.js");

const BASE_URL = "https://vikunja.example.com";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("VikunjaClient", () => {
  it("strips trailing slash from baseUrl", () => {
    const client = new VikunjaClient(`${BASE_URL}/`, "token");
    expect(client.baseUrl).toBe(BASE_URL);
  });

  it("sends the API token in the Authorization header", async () => {
    let capturedAuth: string | null = null;
    server.use(
      http.get(`${BASE_URL}/api/v1/projects`, ({ request }) => {
        capturedAuth = request.headers.get("authorization");
        return HttpResponse.json([]);
      })
    );

    const client = new VikunjaClient(BASE_URL, "test-token");
    await client.request("/projects");

    expect(capturedAuth).toBe("Bearer test-token");
  });

  it("returns parsed JSON on a successful response", async () => {
    const mockProjects = [{ id: 1, title: "Inbox" }];
    server.use(http.get(`${BASE_URL}/api/v1/projects`, () => HttpResponse.json(mockProjects)));

    const client = new VikunjaClient(BASE_URL, "test-token");
    const result = await client.request("/projects");

    expect(result).toEqual(mockProjects);
  });

  it("throws with the status code on a non-ok response", async () => {
    server.use(
      http.get(
        `${BASE_URL}/api/v1/projects`,
        () => new HttpResponse("Unauthorized", { status: 401 })
      )
    );

    const client = new VikunjaClient(BASE_URL, "test-token");

    await expect(client.request("/projects")).rejects.toThrow("Vikunja API 401");
  });
});

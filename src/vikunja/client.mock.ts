import { jest } from "@jest/globals";
import { VikunjaClient } from "./client.js";

export function createMockClient(responses: Record<string, unknown> = {}) {
  return {
    baseUrl: "https://vikunja.example.com",
    request: jest.fn().mockImplementation((path: unknown) => {
      const p = path as string;
      const key = Object.keys(responses).find((k) => p.startsWith(k));
      if (key !== undefined) return Promise.resolve(responses[key]);
      return Promise.reject(new Error(`MockVikunjaClient: no response configured for "${p}"`));
    }),
  } as unknown as VikunjaClient;
}

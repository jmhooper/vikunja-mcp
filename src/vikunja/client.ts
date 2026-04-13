import logger from "../logger.js";

export class VikunjaClient {
  readonly baseUrl: string;
  private readonly apiToken: string;

  constructor(baseUrl: string, apiToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiToken = apiToken;
  }

  async request<T>(
    path: string,
    options: { method?: string; body?: unknown } = {}
  ): Promise<T> {
    const { method = "GET", body } = options;
    const url = `${this.baseUrl}/api/v1${path}`;
    logger.debug("vikunja request", { method, url });

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error("vikunja API error", { status: res.status, url, body });
      throw new Error(`Vikunja API ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }
}

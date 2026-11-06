import type { ResolvedAlvaindesConfig } from "../config.js";
import { AlvaindesError } from "../errors/alvaindes-error.js";

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: unknown;
  signal?: AbortSignal;
};

export class HttpTransport {
  constructor(private readonly config: ResolvedAlvaindesConfig) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith("/") || path.startsWith("//")) {
      throw new Error('API request paths must start with one "/".');
    }

    if (options.signal?.aborted) {
      throw new AlvaindesError({
        status: 0,
        code: "REQUEST_ABORTED",
        message: "The request was aborted.",
      });
    }

    const url = `${this.config.baseURL}${path}`;
    const headers = new Headers(options.headers);

    // Authentication is controlled by the SDK, not by individual callers.
    headers.set("Accept", "application/json");
    headers.set("x-api-key", this.config.apiKey);

    let body: string | undefined;

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }

    const controller = new AbortController();
    let timedOut = false;

    const abortFromCaller = () => controller.abort();

    options.signal?.addEventListener("abort", abortFromCaller, {
      once: true,
    });

    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.config.timeout);

    try {
      const response = await this.config.fetch(url, {
        method: options.method ?? "GET",
        headers,
        ...(body !== undefined ? { body } : {}),
        signal: controller.signal,
      });

      // Keep the timeout active while consuming the response body.
      const responseText = await response.text();
      const responseBody = this.parseResponse(responseText);

      if (!response.ok) {
        throw this.createApiError(response.status, responseBody);
      }

      return responseBody as T;
    } catch (error) {
      if (error instanceof AlvaindesError) {
        throw error;
      }

      if (timedOut) {
        throw new AlvaindesError({
          status: 0,
          code: "TIMEOUT",
          message: `The request timed out after ${this.config.timeout}ms.`,
        });
      }

      if (options.signal?.aborted) {
        throw new AlvaindesError({
          status: 0,
          code: "REQUEST_ABORTED",
          message: "The request was aborted.",
        });
      }

      throw new AlvaindesError({
        status: 0,
        code: "NETWORK_ERROR",
        message: "Unable to complete the request to the Alvaindes API.",
      });
    } finally {
      clearTimeout(timeoutHandle);
      options.signal?.removeEventListener("abort", abortFromCaller);
    }
  }

  private parseResponse(text: string): unknown {
    if (!text) {
      return undefined;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private createApiError(status: number, response: unknown): AlvaindesError {
    const body =
      typeof response === "object" && response !== null
        ? (response as Record<string, unknown>)
        : undefined;

    const responseMessage = body?.message;

    let message = `Alvaindes API request failed with status ${status}.`;

    if (typeof responseMessage === "string") {
      message = responseMessage;
    } else if (
      Array.isArray(responseMessage) &&
      responseMessage.every((item) => typeof item === "string")
    ) {
      message = responseMessage.join("; ");
    }

    return new AlvaindesError({
      status,
      message,
      response,
      ...(typeof body?.code === "string" ? { code: body.code } : {}),
    });
  }
}

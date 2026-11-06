import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveConfig } from "../src/config.js";
import { AlvaindesError } from "../src/errors/alvaindes-error.js";
import { HttpTransport } from "../src/http/transport.js";

function createTransport(fetchImplementation: typeof fetch, timeout = 1_000) {
  const config = resolveConfig({
    apiKey: "alva_test_secret_example",
    baseURL: "https://api.alvaindes.com",
    timeout,
    fetch: fetchImplementation,
  });

  return new HttpTransport(config);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HttpTransport", () => {
  it("sends the API key in the x-api-key header", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: "user_123" }));

    const transport = createTransport(fetchMock);

    await transport.request("/v1/users/user_123");

    const [, request] = fetchMock.mock.calls[0]!;

    expect(new Headers(request?.headers).get("x-api-key")).toBe(
      "alva_test_secret_example",
    );
  });

  it("does not allow callers to override the API key", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ success: true }));

    const transport = createTransport(fetchMock);

    await transport.request("/v1/example", {
      headers: {
        "x-api-key": "attacker-supplied-key",
      },
    });

    const [, request] = fetchMock.mock.calls[0]!;

    expect(new Headers(request?.headers).get("x-api-key")).toBe(
      "alva_test_secret_example",
    );
  });

  it("sends JSON request bodies", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: "order_123" }));

    const transport = createTransport(fetchMock);

    await transport.request("/v1/orders", {
      method: "POST",
      body: {
        symbol: "AAPL",
        quantity: 2,
      },
    });

    const [, request] = fetchMock.mock.calls[0]!;

    expect(request?.method).toBe("POST");
    expect(request?.body).toBe(
      JSON.stringify({
        symbol: "AAPL",
        quantity: 2,
      }),
    );
    expect(new Headers(request?.headers).get("content-type")).toBe(
      "application/json",
    );
  });

  it("parses successful JSON responses", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: "user_123" }));

    const transport = createTransport(fetchMock);

    const result = await transport.request<{ id: string }>(
      "/v1/users/user_123",
    );

    expect(result).toEqual({ id: "user_123" });
  });

  it("supports empty successful responses", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));

    const transport = createTransport(fetchMock);

    const result = await transport.request<void>("/v1/example", {
      method: "DELETE",
    });

    expect(result).toBeUndefined();
  });

  it("converts API errors into AlvaindesError", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          statusCode: 403,
          message: "Insufficient permissions.",
        },
        403,
      ),
    );

    const transport = createTransport(fetchMock);

    await expect(transport.request("/v1/example")).rejects.toMatchObject({
      name: "AlvaindesError",
      status: 403,
      message: "Insufficient permissions.",
    });
  });

  it("preserves the API error response body", async () => {
    const errorBody = {
      statusCode: 400,
      message: "Invalid request.",
    };

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(errorBody, 400));

    const transport = createTransport(fetchMock);

    try {
      await transport.request("/v1/example");
      throw new Error("Expected request to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(AlvaindesError);
      expect((error as AlvaindesError).response).toEqual(errorBody);
    }
  });

  it("converts network failures into a structured error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new TypeError("Failed to fetch"));

    const transport = createTransport(fetchMock);

    await expect(transport.request("/v1/example")).rejects.toMatchObject({
      name: "AlvaindesError",
      status: 0,
      code: "NETWORK_ERROR",
    });
  });

  it("rejects paths that do not start with one slash", async () => {
    const fetchMock = vi.fn<typeof fetch>();

    const transport = createTransport(fetchMock);

    await expect(transport.request("v1/users")).rejects.toThrow(
      'API request paths must start with one "/".',
    );

    await expect(transport.request("//example.com")).rejects.toThrow(
      'API request paths must start with one "/".',
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("converts a request timeout into a structured error", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    );

    const transport = createTransport(fetchMock, 10);

    await expect(transport.request("/v1/example")).rejects.toMatchObject({
      name: "AlvaindesError",
      status: 0,
      code: "TIMEOUT",
    });
  });

  it("keeps the timeout active while reading the response body", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async (_input, init) =>
        ({
          ok: true,
          status: 200,
          text: () =>
            new Promise<string>((_resolve, reject) => {
              init?.signal?.addEventListener(
                "abort",
                () => reject(new DOMException("Aborted", "AbortError")),
                { once: true },
              );
            }),
        }) as Response,
    );

    const transport = createTransport(fetchMock, 10);

    await expect(transport.request("/v1/example")).rejects.toMatchObject({
      name: "AlvaindesError",
      status: 0,
      code: "TIMEOUT",
    });
  });

  it("supports caller cancellation", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    );

    const transport = createTransport(fetchMock, 5_000);
    const controller = new AbortController();

    const request = transport.request("/v1/example", {
      signal: controller.signal,
    });

    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: "AlvaindesError",
      status: 0,
      code: "REQUEST_ABORTED",
    });
  });
});

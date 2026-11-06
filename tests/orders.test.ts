import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const orderResponse = {
  id: "order_123",
  symbol: "AAPL",
  side: "BUY",
  quantity: 5,
  status: "PENDING",
  brokerOrderId: "broker_order_123",
  createdAt: "2026-01-15T10:00:00.000Z",
};

const marketOrder = {
  symbol: "AAPL",
  side: "BUY" as const,
  type: "MARKET" as const,
  quantity: 5,
};

const limitOrder = {
  symbol: "AAPL",
  side: "SELL" as const,
  type: "LIMIT" as const,
  quantity: 3,
  limitPrice: 200,
};

function createClient(fetchMock: typeof fetch) {
  return new Alvaindes({
    apiKey: "alva_test_example",
    baseURL: "https://api.alvaindes.com",
    fetch: fetchMock,
  });
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("OrdersResource", () => {
  it("creates a MARKET order and forwards the idempotency key", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(orderResponse));

    const client = createClient(fetchMock);

    const result = await client.orders.create(
      "user_123",
      "account_123",
      marketOrder,
      { idempotencyKey: "order-aapl-001" },
    );

    expect(result).toEqual(orderResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);
    const headers = new Headers(options?.headers);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/orders",
    );
    expect(options?.method).toBe("POST");
    expect(headers.get("Idempotency-Key")).toBe("order-aapl-001");
    expect(headers.get("x-api-key")).toBe("alva_test_example");
    expect(JSON.parse(options?.body as string)).toEqual(marketOrder);
  });

  it("creates a LIMIT order without generating an idempotency key", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(orderResponse));

    const client = createClient(fetchMock);

    await client.orders.create("user_123", "account_123", limitOrder);

    const [, options] = fetchMock.mock.calls[0]!;
    const headers = new Headers(options?.headers);

    expect(options?.method).toBe("POST");
    expect(headers.has("Idempotency-Key")).toBe(false);
    expect(JSON.parse(options?.body as string)).toEqual(limitOrder);
  });

  it("lists orders for an investment account", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse([orderResponse]));

    const client = createClient(fetchMock);

    const result = await client.orders.list("user_123", "account_123");

    expect(result).toEqual([orderResponse]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/orders",
    );
    expect(options?.method).toBe("GET");
  });

  it("gets an individual order", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(orderResponse));

    const client = createClient(fetchMock);

    const result = await client.orders.get(
      "user_123",
      "account_123",
      "order_123",
    );

    expect(result).toEqual(orderResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/orders/order_123",
    );
    expect(options?.method).toBe("GET");
  });

  it("encodes special characters in path parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(orderResponse));

    const client = createClient(fetchMock);

    await client.orders.get("user/123", "account/123", "order/123");

    const [url] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user%2F123/accounts/account%2F123/orders/order%2F123",
    );
  });

  it("returns an empty array when an account has no orders", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]));

    const client = createClient(fetchMock);

    const result = await client.orders.list("user_123", "account_123");

    expect(result).toEqual([]);
  });
});

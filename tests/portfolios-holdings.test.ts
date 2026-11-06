import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const portfolioResponse = {
  id: "portfolio_123",
  investmentAccountId: "account_123",
  accountValue: 15000.5,
  cashBalance: 2500.25,
  currency: "USD",
  status: "ACTIVE",
  createdAt: "2026-01-15T10:00:00.000Z",
};

const holdingsResponse = [
  {
    id: "holding_123",
    symbol: "AAPL",
    quantity: 10,
    averagePrice: 150.5,
    marketValue: 1750,
  },
  {
    id: "holding_456",
    symbol: "MSFT",
    quantity: 5,
    averagePrice: 300,
    marketValue: 1650,
  },
];

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

describe("PortfoliosResource", () => {
  it("gets a portfolio for an investment account", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(portfolioResponse));

    const client = createClient(fetchMock);

    const result = await client.portfolios.get("user_123", "account_123");

    expect(result).toEqual(portfolioResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/portfolio",
    );
    expect(options?.method).toBe("GET");
  });

  it("encodes special characters in path parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(portfolioResponse));

    const client = createClient(fetchMock);

    await client.portfolios.get("user/123", "account/123");

    const [url] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user%2F123/accounts/account%2F123/portfolio",
    );
  });
});

describe("HoldingsResource", () => {
  it("lists holdings for an investment account", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(holdingsResponse));

    const client = createClient(fetchMock);

    const result = await client.holdings.list("user_123", "account_123");

    expect(result).toEqual(holdingsResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/holdings",
    );
    expect(options?.method).toBe("GET");
  });

  it("encodes special characters in path parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(holdingsResponse));

    const client = createClient(fetchMock);

    await client.holdings.list("user/123", "account/123");

    const [url] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user%2F123/accounts/account%2F123/holdings",
    );
  });

  it("returns an empty array when an account has no holdings", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]));

    const client = createClient(fetchMock);

    const result = await client.holdings.list("user_123", "account_123");

    expect(result).toEqual([]);
  });
});

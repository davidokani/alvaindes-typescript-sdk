import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const quoteResponse = {
  symbol: "AAPL",
  price: 250.5,
  currency: "USD",
  timestamp: "2026-11-06T10:30:00.000Z",
};

describe("MarketDataResource", () => {
  it("gets a market quote using the requested symbol", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(quoteResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.marketData.getQuote("AAPL");

    expect(result).toEqual(quoteResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.origin).toBe("https://api.alvaindes.com");
    expect(parsedURL.pathname).toBe("/v1/market-data/AAPL");
    expect(options?.method).toBe("GET");
    expect(new Headers(options?.headers).get("x-api-key")).toBe(
      "alva_test_example",
    );
  });

  it("encodes special characters in the symbol path parameter", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(quoteResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    await client.marketData.getQuote("BRK/B");

    const [url] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe("/v1/market-data/BRK%2FB");
  });

  it("preserves the normalized quote response fields", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(quoteResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.marketData.getQuote("AAPL");

    expect(result.symbol).toBe("AAPL");
    expect(result.price).toBe(250.5);
    expect(result.currency).toBe("USD");
    expect(result.timestamp).toBe(quoteResponse.timestamp);
  });
});

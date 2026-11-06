import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const assetResponse = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    type: "us_equity",
    status: "active",
  },
];

describe("AssetsResource", () => {
  it("lists assets using the required query parameters", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(assetResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.assets.list({
      connectionId: "connection_123",
      query: "Apple",
    });

    expect(result).toEqual(assetResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.origin).toBe("https://api.alvaindes.com");
    expect(parsedURL.pathname).toBe("/v1/assets");
    expect(parsedURL.searchParams.get("connectionId")).toBe("connection_123");
    expect(parsedURL.searchParams.get("query")).toBe("Apple");
    expect(options?.method).toBe("GET");
  });

  it("encodes special characters in query parameters", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(assetResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    await client.assets.list({
      connectionId: "connection/123",
      query: "Apple & Microsoft",
    });

    const [url] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.searchParams.get("connectionId")).toBe("connection/123");
    expect(parsedURL.searchParams.get("query")).toBe("Apple & Microsoft");
  });

  it("returns an empty array when no assets match", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.assets.list({
      connectionId: "connection_123",
      query: "NoMatchingAsset",
    });

    expect(result).toEqual([]);
  });
});

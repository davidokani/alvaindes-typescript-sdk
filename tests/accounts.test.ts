import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const accountResponse = {
  id: "account_123",
  userId: "user_123",
  accountNumber: "1234567890",
  status: "ACTIVE",
  currency: "USD",
  createdAt: "2026-11-06T12:00:00.000Z",
};

describe("AccountsResource", () => {
  it("creates an investment account", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(accountResponse), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const params = {
      currency: "USD",
      brokerConnectionId: "connection_123",
    };

    const result = await client.accounts.create("user_123", params);

    expect(result).toEqual(accountResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/users/user_123/accounts");
    expect(options?.method).toBe("POST");
    expect(options?.headers).toBeInstanceOf(Headers);
    expect((options?.headers as Headers).get("x-api-key")).toBe(
      "alva_test_example",
    );
    expect(JSON.parse(options?.body as string)).toEqual(params);
  });

  it("lists a user’s investment accounts", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([accountResponse]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.accounts.list("user_123");

    expect(result).toEqual([accountResponse]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/users/user_123/accounts");
    expect(options?.method).toBe("GET");
  });

  it("retrieves a specific investment account", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(accountResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.accounts.get("user_123", "account_123");

    expect(result).toEqual(accountResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(url).toBe(
      "https://api.alvaindes.com/v1/users/user_123/accounts/account_123",
    );
    expect(options?.method).toBe("GET");
  });

  it("URL-encodes user and account IDs", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(accountResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    await client.accounts.get("user/123", "account/123");

    const [url] = fetchMock.mock.calls[0]!;

    expect(url).toBe(
      "https://api.alvaindes.com/v1/users/user%2F123/accounts/account%2F123",
    );
  });
});

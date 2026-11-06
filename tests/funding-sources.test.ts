import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const fundingSourceResponse = {
  id: "funding_source_123",
  investmentAccountId: "account_123",
  type: "ACH",
  status: "ACTIVE",
  currency: "USD",
  brokerReference: "broker_funding_123",
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
};

const createParams = {
  type: "ACH" as const,
  ownerName: "Jane Doe",
  bankAccountNumber: "1234567890",
  bankAccountType: "CHECKING",
  routingNumber: "123456789",
  currency: "USD",
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

describe("FundingSourcesResource", () => {
  it("creates a funding source", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(fundingSourceResponse));

    const client = createClient(fetchMock);

    const result = await client.fundingSources.create(
      "user_123",
      "account_123",
      createParams,
    );

    expect(result).toEqual(fundingSourceResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/funding-sources",
    );
    expect(options?.method).toBe("POST");
    expect(JSON.parse(options?.body as string)).toEqual(createParams);
  });

  it("lists funding sources", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse([fundingSourceResponse]));

    const client = createClient(fetchMock);

    const result = await client.fundingSources.list("user_123", "account_123");

    expect(result).toEqual([fundingSourceResponse]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/funding-sources",
    );
    expect(options?.method).toBe("GET");
  });

  it("refreshes a funding source", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(fundingSourceResponse));

    const client = createClient(fetchMock);

    const result = await client.fundingSources.refresh(
      "user_123",
      "account_123",
      "funding_source_123",
    );

    expect(result).toEqual(fundingSourceResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/funding-sources/funding_source_123/refresh",
    );
    expect(options?.method).toBe("POST");
  });

  it("disables a funding source", async () => {
    const disabledResponse = {
      ...fundingSourceResponse,
      status: "DISABLED",
    };

    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(disabledResponse));

    const client = createClient(fetchMock);

    const result = await client.fundingSources.disable(
      "user_123",
      "account_123",
      "funding_source_123",
    );

    expect(result).toEqual(disabledResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user_123/accounts/account_123/funding-sources/funding_source_123",
    );
    expect(options?.method).toBe("DELETE");
  });

  it("encodes special characters in path parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(fundingSourceResponse));

    const client = createClient(fetchMock);

    await client.fundingSources.refresh(
      "user/123",
      "account/123",
      "funding/source/123",
    );

    const [url] = fetchMock.mock.calls[0]!;
    const parsedURL = new URL(url as string);

    expect(parsedURL.pathname).toBe(
      "/v1/users/user%2F123/accounts/account%2F123/funding-sources/funding%2Fsource%2F123/refresh",
    );
  });

  it("returns an empty array when no funding sources exist", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]));

    const client = createClient(fetchMock);

    const result = await client.fundingSources.list("user_123", "account_123");

    expect(result).toEqual([]);
  });
});

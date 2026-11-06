import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const disclosureResponse = {
  id: "disclosure_123",
  userId: "user_123",
  brokerConnectionId: "connection_123",
  employmentStatus: "EMPLOYED",
  employmentSector: "computers_and_it",
  isControlPerson: false,
  isAffiliatedExchangeOrFinra: false,
  isPoliticallyExposed: false,
  immediateFamilyExposed: false,
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
};

const disclosureParams = {
  employmentStatus: "EMPLOYED",
  employmentSector: "computers_and_it",
  isControlPerson: false,
  isAffiliatedExchangeOrFinra: false,
  isPoliticallyExposed: false,
  immediateFamilyExposed: false,
};

const basePath =
  "/v1/users/user_123/broker-connections/connection_123/disclosures";

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

describe("BrokerDisclosuresResource", () => {
  it("gets existing broker disclosure information", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(disclosureResponse));

    const client = createClient(fetchMock);

    const result = await client.brokerDisclosures.get(
      "user_123",
      "connection_123",
    );

    expect(result).toEqual(disclosureResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(new URL(url as string).pathname).toBe(basePath);
    expect(options?.method).toBe("GET");
  });

  it("returns null when no disclosure exists", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(null));

    const client = createClient(fetchMock);

    const result = await client.brokerDisclosures.get(
      "user_123",
      "connection_123",
    );

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("creates broker disclosure information", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(disclosureResponse, 201));

    const client = createClient(fetchMock);

    const result = await client.brokerDisclosures.create(
      "user_123",
      "connection_123",
      disclosureParams,
    );

    expect(result).toEqual(disclosureResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const headers = new Headers(options?.headers);

    expect(new URL(url as string).pathname).toBe(basePath);
    expect(options?.method).toBe("POST");
    expect(headers.get("Content-Type")).toContain("application/json");
    expect(headers.get("x-api-key")).toBe("alva_test_example");
    expect(JSON.parse(options?.body as string)).toEqual(disclosureParams);
  });

  it("creates disclosure information without an employment sector", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          ...disclosureResponse,
          employmentSector: null,
        },
        201,
      ),
    );

    const client = createClient(fetchMock);

    const params = {
      employmentStatus: "SELF_EMPLOYED",
      isControlPerson: false,
      isAffiliatedExchangeOrFinra: false,
      isPoliticallyExposed: false,
      immediateFamilyExposed: false,
    };

    const result = await client.brokerDisclosures.create(
      "user_123",
      "connection_123",
      params,
    );

    expect(result.employmentSector).toBeNull();

    const [, options] = fetchMock.mock.calls[0]!;

    expect(JSON.parse(options?.body as string)).toEqual(params);
  });

  it("encodes special characters in path parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(disclosureResponse));

    const client = createClient(fetchMock);

    await client.brokerDisclosures.get("user/123", "connection/123");

    const [url] = fetchMock.mock.calls[0]!;

    expect(new URL(url as string).pathname).toBe(
      "/v1/users/user%2F123/broker-connections/connection%2F123/disclosures",
    );
  });

  it("propagates a conflict when disclosure information already exists", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          statusCode: 409,
          message:
            "Broker disclosure already exists for this user and broker connection",
        },
        409,
      ),
    );

    const client = createClient(fetchMock);

    await expect(
      client.brokerDisclosures.create(
        "user_123",
        "connection_123",
        disclosureParams,
      ),
    ).rejects.toMatchObject({
      status: 409,
    });
  });
});

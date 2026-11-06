import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const requirement = {
  agreement: "account_agreement",
  revision: "16.2021.05",
};

const agreementResponse = {
  id: "agreement_123",
  userId: "user_123",
  brokerConnectionId: "connection_123",
  agreement: "account_agreement",
  revision: "16.2021.05",
  signedAt: "2026-01-15T10:00:00.000Z",
  ipAddress: "192.0.2.10",
  createdAt: "2026-01-15T10:00:00.000Z",
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

const basePath =
  "/v1/users/user_123/broker-connections/connection_123/agreements";

describe("BrokerAgreementsResource", () => {
  it("gets the broker's required agreements", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse([requirement]));

    const client = createClient(fetchMock);

    const result = await client.brokerAgreements.getRequirements(
      "user_123",
      "connection_123",
    );

    expect(result).toEqual([requirement]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(new URL(url as string).pathname).toBe(`${basePath}/requirements`);
    expect(options?.method).toBe("GET");
  });

  it("lists previously accepted agreements", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse([agreementResponse]));

    const client = createClient(fetchMock);

    const result = await client.brokerAgreements.listAccepted(
      "user_123",
      "connection_123",
    );

    expect(result).toEqual([agreementResponse]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(new URL(url as string).pathname).toBe(basePath);
    expect(options?.method).toBe("GET");
  });

  it("accepts an agreement revision", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(agreementResponse, 201));

    const client = createClient(fetchMock);

    const params = {
      agreement: "account_agreement",
      revision: "16.2021.05",
    };

    const result = await client.brokerAgreements.accept(
      "user_123",
      "connection_123",
      params,
    );

    expect(result).toEqual(agreementResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;
    const headers = new Headers(options?.headers);

    expect(new URL(url as string).pathname).toBe(basePath);
    expect(options?.method).toBe("POST");
    expect(headers.get("Content-Type")).toContain("application/json");
    expect(headers.get("x-api-key")).toBe("alva_test_example");
    expect(JSON.parse(options?.body as string)).toEqual(params);
  });

  it("accepts an agreement without a revision", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          ...agreementResponse,
          revision: null,
        },
        201,
      ),
    );

    const client = createClient(fetchMock);

    await client.brokerAgreements.accept("user_123", "connection_123", {
      agreement: "account_agreement",
    });

    const [, options] = fetchMock.mock.calls[0]!;

    expect(JSON.parse(options?.body as string)).toEqual({
      agreement: "account_agreement",
    });
  });

  it("encodes special characters in path parameters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse([requirement]));

    const client = createClient(fetchMock);

    await client.brokerAgreements.getRequirements("user/123", "connection/123");

    const [url] = fetchMock.mock.calls[0]!;

    expect(new URL(url as string).pathname).toBe(
      "/v1/users/user%2F123/broker-connections/connection%2F123/agreements/requirements",
    );
  });

  it("returns an empty array when no agreements have been accepted", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]));

    const client = createClient(fetchMock);

    const result = await client.brokerAgreements.listAccepted(
      "user_123",
      "connection_123",
    );

    expect(result).toEqual([]);
  });
});

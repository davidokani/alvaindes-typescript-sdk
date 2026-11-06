import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/index.js";

const kycResponse = {
  id: "kyc_123",
  userId: "user_123",
  status: "PENDING",
  countryOfResidence: "NG",
  nationality: "NG",
  dateOfBirth: "1995-06-15",
  addressLine1: "12 Example Street",
  addressLine2: null,
  addressCity: "Lagos",
  addressState: "Lagos",
  addressPostalCode: null,
  documentType: "PASSPORT" as const,
  documentNumber: "A12345678",
  documentUrl: null,
  documentExpiryDate: null,
  documentCountry: "NG",
  approvedAt: null,
  rejectedReason: null,
  createdAt: "2026-11-06T12:00:00.000Z",
  updatedAt: "2026-11-06T12:00:00.000Z",
};

const createClient = (fetchMock: typeof fetch) =>
  new Alvaindes({
    apiKey: "alva_test_example",
    baseURL: "https://api.alvaindes.com",
    fetch: fetchMock,
  });

describe("KycResource", () => {
  it("submits KYC information", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(kycResponse), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = createClient(fetchMock);

    const params = {
      countryOfResidence: "NG",
      nationality: "NG",
      dateOfBirth: "1995-06-15",
      addressLine1: "12 Example Street",
      addressCity: "Lagos",
      addressState: "Lagos",
      documentType: "PASSPORT" as const,
      documentNumber: "A12345678",
      documentCountry: "NG",
    };

    const result = await client.kyc.submit("user_123", params);

    expect(result).toEqual(kycResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/users/user_123/kyc");
    expect(options?.method).toBe("POST");
    expect(JSON.parse(options?.body as string)).toEqual(params);
  });

  it("retrieves a user’s KYC record", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(kycResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = createClient(fetchMock);

    const result = await client.kyc.get("user_123");

    expect(result).toEqual(kycResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/users/user_123/kyc");
    expect(options?.method).toBe("GET");
  });

  it("updates an existing KYC record", async () => {
    const updatedResponse = {
      ...kycResponse,
      addressLine1: "25 New Street",
    };

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(updatedResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = createClient(fetchMock);
    const params = { addressLine1: "25 New Street" };

    const result = await client.kyc.update("user_123", params);

    expect(result).toEqual(updatedResponse);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/users/user_123/kyc");
    expect(options?.method).toBe("PATCH");
    expect(JSON.parse(options?.body as string)).toEqual(params);
  });

  it("URL-encodes the user ID", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(kycResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = createClient(fetchMock);

    await client.kyc.get("user/123");

    const [url] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/users/user%2F123/kyc");
  });
});

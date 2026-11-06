import { describe, expect, it, vi } from "vitest";
import { Alvaindes } from "../src/client.js";

describe("UsersResource", () => {
  it("creates a user using the public API route", async () => {
    const userResponse = {
      id: "user_123",
      externalId: "customer_001",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phoneNumber: "+2348012345678",
      status: "ACTIVE",
      createdAt: "2026-11-06T12:00:00.000Z",
    };

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(userResponse), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.users.create("app_123", {
      externalId: "customer_001",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phoneNumber: "+2348012345678",
      country: "Nigeria",
    });

    expect(result).toEqual(userResponse);

    const [url, request] = fetchMock.mock.calls[0]!;

    expect(url).toBe("https://api.alvaindes.com/v1/applications/app_123/users");

    expect(request?.method).toBe("POST");

    expect(JSON.parse(request?.body as string)).toEqual({
      externalId: "customer_001",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phoneNumber: "+2348012345678",
      country: "Nigeria",
    });
  });

  it("retrieves a user using the public API route", async () => {
    const userResponse = {
      id: "user_123",
      externalId: null,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phoneNumber: "+2348012345678",
      status: "ACTIVE",
      createdAt: "2026-11-06T12:00:00.000Z",
    };

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(userResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    const result = await client.users.get("app_123", "user_123");

    expect(result).toEqual(userResponse);

    const [url, request] = fetchMock.mock.calls[0]!;

    expect(url).toBe(
      "https://api.alvaindes.com/v1/applications/app_123/users/user_123",
    );

    expect(request?.method).toBe("GET");
  });

  it("encodes application and user identifiers in URL paths", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "user/123",
          externalId: null,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          phoneNumber: "+2348012345678",
          status: "ACTIVE",
          createdAt: "2026-11-06T12:00:00.000Z",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      fetch: fetchMock,
    });

    await client.users.get("app/123", "user/123");

    const [url] = fetchMock.mock.calls[0]!;

    expect(url).toBe(
      "https://api.alvaindes.com/v1/applications/app%2F123/users/user%2F123",
    );
  });

  it("does not expose the control-plane list operation", () => {
    const client = new Alvaindes({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
    });

    expect("list" in client.users).toBe(false);
  });
});

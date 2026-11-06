import { describe, expect, it, vi } from "vitest";

import { DepositsResource } from "../src/resources/deposits.js";
import type { HttpTransport } from "../src/http/transport.js";

describe("DepositsResource", () => {
  const createTransport = () => {
    const request = vi.fn();

    return {
      transport: { request } as unknown as HttpTransport,
      request,
    };
  };

  it("creates a deposit with the supplied funding source", async () => {
    const { transport, request } = createTransport();

    const response = {
      id: "deposit_123",
      amount: 100,
      currency: "USD",
      status: "PENDING",
      reference: "transfer_123",
      createdAt: "2026-10-30T10:00:00.000Z",
    };

    request.mockResolvedValue(response);

    const deposits = new DepositsResource(transport);

    await expect(
      deposits.create("user_123", "account_123", {
        amount: 100,
        currency: "USD",
        fundingSourceId: "funding_source_123",
      }),
    ).resolves.toEqual(response);

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/deposits",
      {
        method: "POST",
        body: {
          amount: 100,
          currency: "USD",
          fundingSourceId: "funding_source_123",
        },
      },
    );
  });

  it("creates a deposit without specifying a funding source", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue({
      id: "deposit_123",
      amount: 100,
      currency: "USD",
      status: "PENDING",
      reference: "transfer_123",
      createdAt: "2026-10-30T10:00:00.000Z",
    });

    const deposits = new DepositsResource(transport);

    await deposits.create("user_123", "account_123", {
      amount: 100,
      currency: "USD",
    });

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/deposits",
      {
        method: "POST",
        body: {
          amount: 100,
          currency: "USD",
        },
      },
    );
  });

  it("forwards an idempotency key", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue({
      id: "deposit_123",
      amount: 100,
      currency: "USD",
      status: "PENDING",
      reference: "transfer_123",
      createdAt: "2026-10-30T10:00:00.000Z",
    });

    const deposits = new DepositsResource(transport);

    await deposits.create(
      "user_123",
      "account_123",
      {
        amount: 100,
        currency: "USD",
      },
      {
        idempotencyKey: "deposit-request-001",
      },
    );

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/deposits",
      {
        method: "POST",
        body: {
          amount: 100,
          currency: "USD",
        },
        headers: {
          "Idempotency-Key": "deposit-request-001",
        },
      },
    );
  });

  it("encodes user and account identifiers in the URL", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue({});

    const deposits = new DepositsResource(transport);

    await deposits.create("user/123", "account 123", {
      amount: 100,
      currency: "USD",
    });

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user%2F123/accounts/account%20123/deposits",
      {
        method: "POST",
        body: {
          amount: 100,
          currency: "USD",
        },
      },
    );
  });
});

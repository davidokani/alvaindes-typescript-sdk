import { describe, expect, it, vi } from "vitest";

import { WithdrawalsResource } from "../src/resources/withdrawals.js";
import type { HttpTransport } from "../src/http/transport.js";

describe("WithdrawalsResource", () => {
  const createTransport = () => {
    const request = vi.fn();

    return {
      transport: { request } as unknown as HttpTransport,
      request,
    };
  };

  it("creates a withdrawal with the supplied funding source", async () => {
    const { transport, request } = createTransport();

    const response = {
      id: "withdrawal_123",
      amount: 300,
      currency: "USD",
      status: "PENDING",
      reference: "transfer_123",
      createdAt: "2026-10-30T10:00:00.000Z",
    };

    request.mockResolvedValue(response);

    const withdrawals = new WithdrawalsResource(transport);

    await expect(
      withdrawals.create("user_123", "account_123", {
        amount: 300,
        currency: "USD",
        fundingSourceId: "funding_source_123",
      }),
    ).resolves.toEqual(response);

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/withdrawals",
      {
        method: "POST",
        body: {
          amount: 300,
          currency: "USD",
          fundingSourceId: "funding_source_123",
        },
      },
    );
  });

  it("creates a withdrawal without specifying a funding source", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue({
      id: "withdrawal_123",
      amount: 300,
      currency: "USD",
      status: "PENDING",
      reference: "transfer_123",
      createdAt: "2026-10-30T10:00:00.000Z",
    });

    const withdrawals = new WithdrawalsResource(transport);

    await withdrawals.create("user_123", "account_123", {
      amount: 300,
      currency: "USD",
    });

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/withdrawals",
      {
        method: "POST",
        body: {
          amount: 300,
          currency: "USD",
        },
      },
    );
  });

  it("forwards an idempotency key", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue({
      id: "withdrawal_123",
      amount: 300,
      currency: "USD",
      status: "PENDING",
      reference: "transfer_123",
      createdAt: "2026-10-30T10:00:00.000Z",
    });

    const withdrawals = new WithdrawalsResource(transport);

    await withdrawals.create(
      "user_123",
      "account_123",
      {
        amount: 300,
        currency: "USD",
      },
      {
        idempotencyKey: "withdrawal-request-001",
      },
    );

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/withdrawals",
      {
        method: "POST",
        body: {
          amount: 300,
          currency: "USD",
        },
        headers: {
          "Idempotency-Key": "withdrawal-request-001",
        },
      },
    );
  });

  it("encodes user and account identifiers in the URL", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue({});

    const withdrawals = new WithdrawalsResource(transport);

    await withdrawals.create("user/123", "account 123", {
      amount: 300,
      currency: "USD",
    });

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user%2F123/accounts/account%20123/withdrawals",
      {
        method: "POST",
        body: {
          amount: 300,
          currency: "USD",
        },
      },
    );
  });
});

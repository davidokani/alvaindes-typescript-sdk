import { describe, expect, it, vi } from "vitest";

import { TransactionsResource } from "../src/resources/transactions.js";
import type { HttpTransport } from "../src/http/transport.js";

describe("TransactionsResource", () => {
  const createTransport = () => {
    const request = vi.fn();

    return {
      transport: { request } as unknown as HttpTransport,
      request,
    };
  };

  it("lists transactions for an investment account", async () => {
    const { transport, request } = createTransport();

    const response = [
      {
        id: "transaction_123",
        type: "DEPOSIT",
        amount: 500,
        currency: "USD",
        description: "Account deposit",
        status: "COMPLETED",
        createdAt: "2026-10-30T10:00:00.000Z",
      },
      {
        id: "transaction_456",
        type: "WITHDRAWAL",
        amount: 100,
        currency: "USD",
        status: "PENDING",
        createdAt: "2026-10-29T10:00:00.000Z",
      },
    ];

    request.mockResolvedValue(response);

    const transactions = new TransactionsResource(transport);

    await expect(transactions.list("user_123", "account_123")).resolves.toEqual(
      response,
    );

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user_123/accounts/account_123/transactions",
      {
        method: "GET",
      },
    );
  });

  it("returns an empty array when there are no transactions", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue([]);

    const transactions = new TransactionsResource(transport);

    await expect(transactions.list("user_123", "account_123")).resolves.toEqual(
      [],
    );
  });

  it("encodes user and account identifiers in the URL", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue([]);

    const transactions = new TransactionsResource(transport);

    await transactions.list("user/123", "account 123");

    expect(request).toHaveBeenCalledWith(
      "/v1/users/user%2F123/accounts/account%20123/transactions",
      {
        method: "GET",
      },
    );
  });

  it("does not add query parameters or request headers", async () => {
    const { transport, request } = createTransport();

    request.mockResolvedValue([]);

    const transactions = new TransactionsResource(transport);

    await transactions.list("user_123", "account_123");

    expect(request).toHaveBeenCalledTimes(1);

    const [path, options] = request.mock.calls[0];

    expect(path).not.toContain("?");
    expect(options).toEqual({ method: "GET" });
  });
});

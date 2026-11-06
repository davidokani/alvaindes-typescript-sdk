import type { HttpTransport } from "../http/transport.js";
import type { TransactionResponse } from "../types/transactions.js";

export class TransactionsResource {
  constructor(private readonly transport: HttpTransport) {}

  list(userId: string, accountId: string): Promise<TransactionResponse[]> {
    return this.transport.request<TransactionResponse[]>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/transactions`,
      {
        method: "GET",
      },
    );
  }
}

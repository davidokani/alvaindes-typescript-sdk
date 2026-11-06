import type { HttpTransport } from "../http/transport.js";
import type { HoldingResponse } from "../types/holdings.js";

export class HoldingsResource {
  constructor(private readonly transport: HttpTransport) {}

  list(userId: string, accountId: string): Promise<HoldingResponse[]> {
    return this.transport.request<HoldingResponse[]>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/holdings`,
    );
  }
}

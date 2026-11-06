import type { HttpTransport } from "../http/transport.js";
import type { PortfolioResponse } from "../types/portfolios.js";

export class PortfoliosResource {
  constructor(private readonly transport: HttpTransport) {}

  get(userId: string, accountId: string): Promise<PortfolioResponse> {
    return this.transport.request<PortfolioResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/portfolio`,
    );
  }
}

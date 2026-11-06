import type { HttpTransport } from "../http/transport.js";
import type {
  CreateInvestmentAccountParams,
  InvestmentAccountResponse,
} from "../types/accounts.js";

export class AccountsResource {
  constructor(private readonly transport: HttpTransport) {}

  create(
    userId: string,
    params: CreateInvestmentAccountParams,
  ): Promise<InvestmentAccountResponse> {
    return this.transport.request<InvestmentAccountResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  list(userId: string): Promise<InvestmentAccountResponse[]> {
    return this.transport.request<InvestmentAccountResponse[]>(
      `/v1/users/${encodeURIComponent(userId)}/accounts`,
    );
  }

  get(userId: string, accountId: string): Promise<InvestmentAccountResponse> {
    return this.transport.request<InvestmentAccountResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}`,
    );
  }
}

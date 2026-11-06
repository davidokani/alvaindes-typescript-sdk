import type { HttpTransport } from "../http/transport.js";
import type {
  CreateFundingSourceParams,
  FundingSourceResponse,
} from "../types/funding-sources.js";

export class FundingSourcesResource {
  constructor(private readonly transport: HttpTransport) {}

  create(
    userId: string,
    accountId: string,
    params: CreateFundingSourceParams,
  ): Promise<FundingSourceResponse> {
    return this.transport.request<FundingSourceResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/funding-sources`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  list(userId: string, accountId: string): Promise<FundingSourceResponse[]> {
    return this.transport.request<FundingSourceResponse[]>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/funding-sources`,
    );
  }

  refresh(
    userId: string,
    accountId: string,
    fundingSourceId: string,
  ): Promise<FundingSourceResponse> {
    return this.transport.request<FundingSourceResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/funding-sources/${encodeURIComponent(fundingSourceId)}/refresh`,
      {
        method: "POST",
      },
    );
  }

  disable(
    userId: string,
    accountId: string,
    fundingSourceId: string,
  ): Promise<FundingSourceResponse> {
    return this.transport.request<FundingSourceResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/funding-sources/${encodeURIComponent(fundingSourceId)}`,
      {
        method: "DELETE",
      },
    );
  }
}

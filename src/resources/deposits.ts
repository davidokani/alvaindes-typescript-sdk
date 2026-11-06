import type { HttpTransport } from "../http/transport.js";
import type {
  CreateDepositOptions,
  CreateDepositParams,
  DepositResponse,
} from "../types/deposits.js";

export class DepositsResource {
  constructor(private readonly transport: HttpTransport) {}

  create(
    userId: string,
    accountId: string,
    params: CreateDepositParams,
    options: CreateDepositOptions = {},
  ): Promise<DepositResponse> {
    const headers = options.idempotencyKey
      ? { "Idempotency-Key": options.idempotencyKey }
      : undefined;

    return this.transport.request<DepositResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/deposits`,
      {
        method: "POST",
        body: params,
        ...(headers ? { headers } : {}),
      },
    );
  }
}

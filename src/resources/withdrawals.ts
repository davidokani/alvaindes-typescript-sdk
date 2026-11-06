import type { HttpTransport } from "../http/transport.js";
import type {
  CreateWithdrawalOptions,
  CreateWithdrawalParams,
  WithdrawalResponse,
} from "../types/withdrawals.js";

export class WithdrawalsResource {
  constructor(private readonly transport: HttpTransport) {}

  create(
    userId: string,
    accountId: string,
    params: CreateWithdrawalParams,
    options: CreateWithdrawalOptions = {},
  ): Promise<WithdrawalResponse> {
    const headers = options.idempotencyKey
      ? { "Idempotency-Key": options.idempotencyKey }
      : undefined;

    return this.transport.request<WithdrawalResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/withdrawals`,
      {
        method: "POST",
        body: params,
        ...(headers ? { headers } : {}),
      },
    );
  }
}

import type { HttpTransport } from "../http/transport.js";
import type {
  KycResponse,
  SubmitKycParams,
  UpdateKycParams,
} from "../types/kyc.js";

export class KycResource {
  constructor(private readonly transport: HttpTransport) {}

  submit(userId: string, params: SubmitKycParams): Promise<KycResponse> {
    return this.transport.request<KycResponse>(
      `/v1/users/${encodeURIComponent(userId)}/kyc`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  get(userId: string): Promise<KycResponse> {
    return this.transport.request<KycResponse>(
      `/v1/users/${encodeURIComponent(userId)}/kyc`,
    );
  }

  update(userId: string, params: UpdateKycParams): Promise<KycResponse> {
    return this.transport.request<KycResponse>(
      `/v1/users/${encodeURIComponent(userId)}/kyc`,
      {
        method: "PATCH",
        body: params,
      },
    );
  }
}

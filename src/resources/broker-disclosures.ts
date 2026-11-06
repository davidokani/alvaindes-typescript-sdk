import type { HttpTransport } from "../http/transport.js";

import type {
  BrokerDisclosureResponse,
  CreateBrokerDisclosureParams,
} from "../types/broker-disclosures.js";

export class BrokerDisclosuresResource {
  constructor(private readonly transport: HttpTransport) {}

  get(
    userId: string,
    brokerConnectionId: string,
  ): Promise<BrokerDisclosureResponse | null> {
    return this.transport.request<BrokerDisclosureResponse | null>(
      `/v1/users/${encodeURIComponent(userId)}/broker-connections/${encodeURIComponent(brokerConnectionId)}/disclosures`,
      {
        method: "GET",
      },
    );
  }

  create(
    userId: string,
    brokerConnectionId: string,
    params: CreateBrokerDisclosureParams,
  ): Promise<BrokerDisclosureResponse> {
    return this.transport.request<BrokerDisclosureResponse>(
      `/v1/users/${encodeURIComponent(userId)}/broker-connections/${encodeURIComponent(brokerConnectionId)}/disclosures`,
      {
        method: "POST",
        body: params,
      },
    );
  }
}

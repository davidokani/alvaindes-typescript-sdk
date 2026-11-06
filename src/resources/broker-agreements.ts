import type { HttpTransport } from "../http/transport.js";

import type {
  AcceptBrokerAgreementParams,
  BrokerAgreementRequirement,
  BrokerAgreementResponse,
} from "../types/broker-agreements.js";

export class BrokerAgreementsResource {
  constructor(private readonly transport: HttpTransport) {}

  getRequirements(
    userId: string,
    brokerConnectionId: string,
  ): Promise<BrokerAgreementRequirement[]> {
    return this.transport.request<BrokerAgreementRequirement[]>(
      `/v1/users/${encodeURIComponent(userId)}/broker-connections/${encodeURIComponent(brokerConnectionId)}/agreements/requirements`,
      {
        method: "GET",
      },
    );
  }

  listAccepted(
    userId: string,
    brokerConnectionId: string,
  ): Promise<BrokerAgreementResponse[]> {
    return this.transport.request<BrokerAgreementResponse[]>(
      `/v1/users/${encodeURIComponent(userId)}/broker-connections/${encodeURIComponent(brokerConnectionId)}/agreements`,
      {
        method: "GET",
      },
    );
  }

  accept(
    userId: string,
    brokerConnectionId: string,
    params: AcceptBrokerAgreementParams,
  ): Promise<BrokerAgreementResponse> {
    return this.transport.request<BrokerAgreementResponse>(
      `/v1/users/${encodeURIComponent(userId)}/broker-connections/${encodeURIComponent(brokerConnectionId)}/agreements`,
      {
        method: "POST",
        body: params,
      },
    );
  }
}

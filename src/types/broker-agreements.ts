export type BrokerAgreementRequirement = {
  agreement: string;
  revision?: string;
};

export type AcceptBrokerAgreementParams = {
  agreement: string;
  revision?: string;
};

export type BrokerAgreementResponse = {
  id: string;
  userId: string;
  brokerConnectionId: string;
  agreement: string;
  revision: string | null;
  signedAt: string;
  ipAddress: string;
  createdAt: string;
};

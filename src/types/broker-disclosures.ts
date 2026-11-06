export type CreateBrokerDisclosureParams = {
  employmentStatus: string;
  employmentSector?: string;
  isControlPerson: boolean;
  isAffiliatedExchangeOrFinra: boolean;
  isPoliticallyExposed: boolean;
  immediateFamilyExposed: boolean;
};

export type BrokerDisclosureResponse = {
  id: string;
  userId: string;
  brokerConnectionId: string;
  employmentStatus: string;
  employmentSector: string | null;
  isControlPerson: boolean;
  isAffiliatedExchangeOrFinra: boolean;
  isPoliticallyExposed: boolean;
  immediateFamilyExposed: boolean;
  createdAt: string;
  updatedAt: string;
};

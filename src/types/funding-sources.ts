export type FundingSourceType = "ACH" | "BANK_ACCOUNT" | "WIRE" | "OTHER";

export type FundingSourceStatus = "PENDING" | "ACTIVE" | "DISABLED";

/**
 * The current backend create DTO accepts ACH only.
 */
export type CreateFundingSourceParams = {
  type: "ACH";
  ownerName: string;
  bankAccountNumber: string;
  bankAccountType: string;
  routingNumber: string;
  currency: string;
};

export type FundingSourceResponse = {
  id: string;
  investmentAccountId: string;
  type: FundingSourceType;
  status: FundingSourceStatus;
  currency: string;
  brokerReference: string | null;
  createdAt: string;
  updatedAt: string;
};

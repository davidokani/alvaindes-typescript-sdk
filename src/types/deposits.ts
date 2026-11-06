export type CreateDepositParams = {
  amount: number;
  currency: string;
  fundingSourceId?: string;
};

export type CreateDepositOptions = {
  idempotencyKey?: string;
};

export type DepositResponse = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  createdAt: string;
};

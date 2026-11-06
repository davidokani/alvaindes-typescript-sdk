export type CreateWithdrawalParams = {
  amount: number;
  currency: string;
  fundingSourceId?: string;
};

export type CreateWithdrawalOptions = {
  idempotencyKey?: string;
};

export type WithdrawalResponse = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  createdAt: string;
};

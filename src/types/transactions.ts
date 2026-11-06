export type TransactionResponse = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  createdAt: string;
};

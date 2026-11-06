export type CreateInvestmentAccountParams = {
  currency: string;
  brokerConnectionId: string;
};

export type InvestmentAccountResponse = {
  id: string;
  userId: string;
  accountNumber: string;
  status: string;
  currency: string;
  createdAt: string;
};

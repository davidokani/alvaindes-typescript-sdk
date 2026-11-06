export { Alvaindes } from "./client.js";

export type { AlvaindesConfig, ResolvedAlvaindesConfig } from "./config.js";

export {
  AlvaindesError,
  type AlvaindesErrorDetails,
} from "./errors/alvaindes-error.js";

export { HttpTransport, type RequestOptions } from "./http/transport.js";

export { UsersResource } from "./resources/users.js";
export { AccountsResource } from "./resources/accounts.js";
export { KycResource } from "./resources/kyc.js";
export { AssetsResource } from "./resources/assets.js";
export { FundingSourcesResource } from "./resources/funding-sources.js";
export { PortfoliosResource } from "./resources/portfolios.js";
export { HoldingsResource } from "./resources/holdings.js";
export { OrdersResource } from "./resources/orders.js";
export { DepositsResource } from "./resources/deposits.js";
export { WithdrawalsResource } from "./resources/withdrawals.js";
export { TransactionsResource } from "./resources/transactions.js";
export { BrokerAgreementsResource } from "./resources/broker-agreements.js";
export { BrokerDisclosuresResource } from "./resources/broker-disclosures.js";
export { MarketDataResource } from "./resources/market-data.js";

export type { CreateUserParams, UserResponse } from "./types/users.js";

export type {
  CreateInvestmentAccountParams,
  InvestmentAccountResponse,
} from "./types/accounts.js";

export type {
  KycDocumentType,
  SubmitKycParams,
  UpdateKycParams,
  KycResponse,
} from "./types/kyc.js";

export type { AssetResponse, ListAssetsParams } from "./types/assets.js";

export type {
  CreateFundingSourceParams,
  FundingSourceResponse,
  FundingSourceStatus,
  FundingSourceType,
} from "./types/funding-sources.js";

export type { PortfolioResponse } from "./types/portfolios.js";

export type { HoldingResponse } from "./types/holdings.js";

export type {
  CreateOrderOptions,
  CreateOrderParams,
  OrderResponse,
  OrderSide,
  OrderType,
} from "./types/orders.js";

export type {
  CreateDepositOptions,
  CreateDepositParams,
  DepositResponse,
} from "./types/deposits.js";

export type {
  CreateWithdrawalOptions,
  CreateWithdrawalParams,
  WithdrawalResponse,
} from "./types/withdrawals.js";

export type { TransactionResponse } from "./types/transactions.js";

export type {
  AcceptBrokerAgreementParams,
  BrokerAgreementRequirement,
  BrokerAgreementResponse,
} from "./types/broker-agreements.js";

export type {
  BrokerDisclosureResponse,
  CreateBrokerDisclosureParams,
} from "./types/broker-disclosures.js";

export type { MarketQuoteResponse } from "./types/market-data.js";

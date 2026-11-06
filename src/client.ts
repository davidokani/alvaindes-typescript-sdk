import { resolveConfig, type AlvaindesConfig } from "./config.js";
import { HttpTransport, type RequestOptions } from "./http/transport.js";

import { AccountsResource } from "./resources/accounts.js";
import { AssetsResource } from "./resources/assets.js";
import { DepositsResource } from "./resources/deposits.js";
import { FundingSourcesResource } from "./resources/funding-sources.js";
import { HoldingsResource } from "./resources/holdings.js";
import { KycResource } from "./resources/kyc.js";
import { OrdersResource } from "./resources/orders.js";
import { PortfoliosResource } from "./resources/portfolios.js";
import { UsersResource } from "./resources/users.js";
import { WithdrawalsResource } from "./resources/withdrawals.js";
import { TransactionsResource } from "./resources/transactions.js";
import { BrokerAgreementsResource } from "./resources/broker-agreements.js";
import { BrokerDisclosuresResource } from "./resources/broker-disclosures.js";
import { MarketDataResource } from "./resources/market-data.js";

export class Alvaindes {
  private readonly transport: HttpTransport;

  readonly users: UsersResource;
  readonly accounts: AccountsResource;
  readonly kyc: KycResource;
  readonly assets: AssetsResource;
  readonly fundingSources: FundingSourcesResource;
  readonly portfolios: PortfoliosResource;
  readonly holdings: HoldingsResource;
  readonly orders: OrdersResource;
  readonly deposits: DepositsResource;
  readonly withdrawals: WithdrawalsResource;
  readonly transactions: TransactionsResource;
  readonly brokerAgreements: BrokerAgreementsResource;
  readonly brokerDisclosures: BrokerDisclosuresResource;
  readonly marketData: MarketDataResource;

  constructor(config: AlvaindesConfig) {
    const resolvedConfig = resolveConfig(config);

    this.transport = new HttpTransport(resolvedConfig);

    this.users = new UsersResource(this.transport);
    this.accounts = new AccountsResource(this.transport);
    this.kyc = new KycResource(this.transport);
    this.assets = new AssetsResource(this.transport);
    this.fundingSources = new FundingSourcesResource(this.transport);
    this.portfolios = new PortfoliosResource(this.transport);
    this.holdings = new HoldingsResource(this.transport);
    this.orders = new OrdersResource(this.transport);
    this.deposits = new DepositsResource(this.transport);
    this.withdrawals = new WithdrawalsResource(this.transport);
    this.transactions = new TransactionsResource(this.transport);
    this.brokerAgreements = new BrokerAgreementsResource(this.transport);
    this.brokerDisclosures = new BrokerDisclosuresResource(this.transport);
    this.marketData = new MarketDataResource(this.transport);
  }

  request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.transport.request<T>(path, options);
  }
}

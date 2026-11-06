import type { HttpTransport } from "../http/transport.js";
import type { MarketQuoteResponse } from "../types/market-data.js";

export class MarketDataResource {
  constructor(private readonly transport: HttpTransport) {}

  getQuote(symbol: string): Promise<MarketQuoteResponse> {
    return this.transport.request<MarketQuoteResponse>(
      `/v1/market-data/${encodeURIComponent(symbol)}`,
    );
  }
}

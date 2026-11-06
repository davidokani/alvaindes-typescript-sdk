export type OrderSide = "BUY" | "SELL";

export type OrderType = "MARKET" | "LIMIT";

type CreateOrderBaseParams = {
  symbol: string;
  side: OrderSide;
  quantity: number;
};

export type CreateOrderParams = CreateOrderBaseParams &
  (
    | {
        type: "MARKET";
        limitPrice?: never;
      }
    | {
        type: "LIMIT";
        limitPrice: number;
      }
  );

export type CreateOrderOptions = {
  /**
   * Optional key used by the API to identify and recover
   * the same order submission.
   */
  idempotencyKey?: string;
};

export type OrderResponse = {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  status: string;
  brokerOrderId: string | null;
  createdAt: string;
};

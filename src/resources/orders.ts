import type { HttpTransport } from "../http/transport.js";
import type {
  CreateOrderOptions,
  CreateOrderParams,
  OrderResponse,
} from "../types/orders.js";

export class OrdersResource {
  constructor(private readonly transport: HttpTransport) {}

  create(
    userId: string,
    accountId: string,
    params: CreateOrderParams,
    options: CreateOrderOptions = {},
  ): Promise<OrderResponse> {
    const headers = options.idempotencyKey
      ? { "Idempotency-Key": options.idempotencyKey }
      : undefined;

    return this.transport.request<OrderResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/orders`,
      {
        method: "POST",
        body: params,
        ...(headers ? { headers } : {}),
      },
    );
  }

  list(userId: string, accountId: string): Promise<OrderResponse[]> {
    return this.transport.request<OrderResponse[]>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/orders`,
    );
  }

  get(
    userId: string,
    accountId: string,
    orderId: string,
  ): Promise<OrderResponse> {
    return this.transport.request<OrderResponse>(
      `/v1/users/${encodeURIComponent(userId)}/accounts/${encodeURIComponent(accountId)}/orders/${encodeURIComponent(orderId)}`,
    );
  }
}

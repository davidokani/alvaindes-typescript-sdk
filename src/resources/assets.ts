import type { HttpTransport } from "../http/transport.js";
import type { AssetResponse, ListAssetsParams } from "../types/assets.js";

export class AssetsResource {
  constructor(private readonly transport: HttpTransport) {}

  list(params: ListAssetsParams): Promise<AssetResponse[]> {
    const searchParams = new URLSearchParams({
      connectionId: params.connectionId,
      query: params.query,
    });

    return this.transport.request<AssetResponse[]>(
      `/v1/assets?${searchParams.toString()}`,
    );
  }
}

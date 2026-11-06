export type AssetResponse = {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  type: string;
  status: string;
};

export type ListAssetsParams = {
  connectionId: string;
  query: string;
};

export type AlvaindesConfig = {
  apiKey: string;
  /**
   * API origin, for example https://api.alvaindes.com.
   * Do not include /v1 in this value.
   */
  baseURL: string;
  timeout?: number;
  fetch?: typeof globalThis.fetch;
};

export type ResolvedAlvaindesConfig = {
  apiKey: string;
  baseURL: string;
  timeout: number;
  fetch: typeof globalThis.fetch;
};

const DEFAULT_TIMEOUT = 30_000;

export function resolveConfig(
  config: AlvaindesConfig,
): ResolvedAlvaindesConfig {
  if (!config.apiKey || !config.apiKey.trim()) {
    throw new Error("Alvaindes API key is required.");
  }

  if (!config.baseURL || !config.baseURL.trim()) {
    throw new Error("Alvaindes base URL is required.");
  }

  let parsedURL: URL;

  try {
    parsedURL = new URL(config.baseURL);
  } catch {
    throw new Error("Alvaindes base URL must be a valid URL.");
  }

  if (!["http:", "https:"].includes(parsedURL.protocol)) {
    throw new Error("Alvaindes base URL must use HTTP or HTTPS.");
  }

  if (parsedURL.username || parsedURL.password) {
    throw new Error("Alvaindes base URL must not contain credentials.");
  }

  if (parsedURL.search || parsedURL.hash) {
    throw new Error(
      "Alvaindes base URL must not contain a query string or fragment.",
    );
  }

  if (parsedURL.pathname !== "/" && parsedURL.pathname !== "") {
    throw new Error(
      "Alvaindes base URL must be an API origin without a path prefix.",
    );
  }

  const timeout = config.timeout ?? DEFAULT_TIMEOUT;

  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new Error("Alvaindes timeout must be a positive integer.");
  }

  const resolved: ResolvedAlvaindesConfig = {
    apiKey: config.apiKey.trim(),
    baseURL: parsedURL.origin,
    timeout,
    fetch: config.fetch ?? globalThis.fetch,
  };

  if (typeof resolved.fetch !== "function") {
    throw new Error(
      "This environment does not provide a fetch implementation.",
    );
  }

  return resolved;
}

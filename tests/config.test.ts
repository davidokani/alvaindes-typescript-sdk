import { describe, expect, it, vi } from "vitest";
import { resolveConfig } from "../src/config.js";

describe("resolveConfig", () => {
  it("resolves a valid configuration", () => {
    const config = resolveConfig({
      apiKey: " alva_test_example ",
      baseURL: "https://api.alvaindes.com/",
    });

    expect(config.apiKey).toBe("alva_test_example");
    expect(config.baseURL).toBe("https://api.alvaindes.com");
    expect(config.timeout).toBe(30_000);
    expect(config.fetch).toBe(globalThis.fetch);
  });

  it("uses a custom timeout and fetch implementation", () => {
    const customFetch = vi.fn();

    const config = resolveConfig({
      apiKey: "alva_test_example",
      baseURL: "https://api.alvaindes.com",
      timeout: 5_000,
      fetch: customFetch as unknown as typeof fetch,
    });

    expect(config.timeout).toBe(5_000);
    expect(config.fetch).toBe(customFetch);
  });

  it("rejects an empty API key", () => {
    expect(() =>
      resolveConfig({
        apiKey: " ",
        baseURL: "https://api.alvaindes.com",
      }),
    ).toThrow("Alvaindes API key is required.");
  });

  it("rejects an invalid base URL", () => {
    expect(() =>
      resolveConfig({
        apiKey: "alva_test_example",
        baseURL: "not-a-url",
      }),
    ).toThrow("Alvaindes base URL must be a valid URL.");
  });

  it("rejects non-HTTP protocols", () => {
    expect(() =>
      resolveConfig({
        apiKey: "alva_test_example",
        baseURL: "ftp:/api.alvaindes.com",
      }),
    ).toThrow("Alvaindes base URL must use HTTP or HTTPS.");
  });

  it("rejects credentials in the base URL", () => {
    expect(() =>
      resolveConfig({
        apiKey: "alva_test_example",
        baseURL: "https://user:password@api.example.com",
      }),
    ).toThrow("Alvaindes base URL must not contain credentials.");
  });

  it("rejects a base URL containing a path prefix", () => {
    expect(() =>
      resolveConfig({
        apiKey: "alva_test_example",
        baseURL: "https://api.alvaindes.com/v1",
      }),
    ).toThrow(
      "Alvaindes base URL must be an API origin without a path prefix.",
    );
  });

  it("rejects invalid timeouts", () => {
    expect(() =>
      resolveConfig({
        apiKey: "alva_test_example",
        baseURL: "https://api.alvaindes.com",
        timeout: 0,
      }),
    ).toThrow("Alvaindes timeout must be a positive integer.");
  });
});

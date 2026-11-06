# Alvaindes TypeScript SDK

The TypeScript SDK for integrating applications with the Alvaindes brokerage infrastructure API.

## Installation

```bash
npm install alvaindes-typescript-sdk
```

## Basic usage

```typescript
import { Alvaindes } from "alvaindes-typescript-sdk";

const alvaindes = new Alvaindes({
  apiKey: process.env.ALVAINDES_API_KEY!,
  baseURL: process.env.ALVAINDES_BASE_URL!,
  timeout: 30_000,
});
```

The `baseURL` must be the API origin without a path prefix or `/v1`.

## Error handling

```typescript
import { Alvaindes, AlvaindesError } from "alvaindes-typescript-sdk";

const client = new Alvaindes({
  apiKey: process.env.ALVAINDES_API_KEY!,
  baseURL: process.env.ALVAINDES_BASE_URL!,
});

try {
  // Use an SDK resource method here.
} catch (error) {
  if (error instanceof AlvaindesError) {
    console.error(error.status);
    console.error(error.message);
  }

  throw error;
}
```

## Authentication

The SDK authenticates requests using the `x-api-key` HTTP header.

The API key determines the environment and permissions assigned by Alvaindes.

Never expose secret API keys in browser-side applications or commit them to source control.

## API versioning

The SDK targets the public, versioned Alvaindes API under `/v1`.

Internal, administrative, and control-plane endpoints are not part of this SDK.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## License

MIT

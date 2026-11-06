# Alvaindes TypeScript SDK

<p align="center">
  <img src="./assets/alvaindes.png" alt="Alvaindes Logo" width="140">
</p>

<h1 align="center">Alvaindes SDK</h1>

<p align="center">
 Official TypeScript SDK for integrating Alvaindes brokerage infrastructure API.
</p>

<p align="center">
  Use the SDK to work with users, investment accounts, KYC, assets, funding sources, portfolios, holdings, orders, deposits, withdrawals, transactions, broker agreements, broker disclosures, and market data.
</p>

---

## Requirements

- Node.js 18 or later
- An Alvaindes API key
- Your Alvaindes API base URL

## Installation

```bash
npm install alvaindes-typescript-sdk
```

## Getting started

```typescript
import { Alvaindes } from "alvaindes-typescript-sdk";

const client = new Alvaindes({
  apiKey: process.env.ALVAINDES_API_KEY!,
  baseURL: process.env.ALVAINDES_BASE_URL!,
  timeout: 30_000,
});
```

The `baseURL` must be the API origin only. Do not include `/v1` or another path prefix.

Keep your API key on a trusted server. Do not expose it in browser-side applications or commit it to source control.

## Available resources

| Resource           | Methods                                           |
| ------------------ | ------------------------------------------------- |
| Users              | `create()`, `get()`                               |
| Accounts           | `create()`, `list()`, `get()`                     |
| KYC                | `submit()`, `get()`, `update()`                   |
| Assets             | `list()`                                          |
| Funding sources    | `create()`, `list()`, `refresh()`, `disable()`    |
| Portfolios         | `get()`                                           |
| Holdings           | `list()`                                          |
| Orders             | `create()`, `list()`, `get()`                     |
| Deposits           | `create()`                                        |
| Withdrawals        | `create()`                                        |
| Transactions       | `list()`                                          |
| Broker agreements  | `getRequirements()`, `listAccepted()`, `accept()` |
| Broker disclosures | `get()`, `create()`                               |
| Market data        | `getQuote()`                                      |

## Examples

### Create a user

```typescript
const user = await client.users.create("YOUR_APPLICATION_ID", {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phoneNumber: "+2348012345678",
  country: "NG",
  externalId: "customer-001",
});
```

### Create an investment account

```typescript
const account = await client.accounts.create(user.id, {
  currency: "USD",
  brokerConnectionId: "YOUR_BROKER_CONNECTION_ID",
});
```

### Submit KYC information

```typescript
const kyc = await client.kyc.submit(user.id, {
  countryOfResidence: "NG",
  nationality: "NG",
  dateOfBirth: "1995-06-15",
  addressLine1: "10 Example Street",
  addressCity: "Lagos",
  documentType: "NATIONAL_ID",
  documentNumber: "123456789",
});
```

### List available assets

```typescript
const assets = await client.assets.list({
  connectionId: "YOUR_BROKER_CONNECTION_ID",
  query: "AAPL",
});
```

### Create a funding source

```typescript
const fundingSource = await client.fundingSources.create(user.id, account.id, {
  type: "ACH",
  ownerName: "Jane Doe",
  bankAccountNumber: "1234567890",
  bankAccountType: "CHECKING",
  routiUSDumber: "123456789",
  currency: "USD",
});
```

### Retrieve a portfolio

```typescript
const portfolio = await client.portfolios.get(user.id, account.id);
```

### List holdings

```typescript
const holdings = await client.holdings.list(user.id, account.id);
```

### Create an order

```typescript
const order = await client.orders.create(
  user.id,
  account.id,
  {
    symbol: "AAPL",
    side: "BUY",
    type: "MARKET",
    quantity: 1,
  },
  {
    idempotencyKey: "order-request-001",
  },
);
```

For a limit order, provide `type: "LIMIT"` and a positive `limitPrice`.

### Create a deposit

```typescript
const deposit = await client.deposits.create(
  user.id,
  account.id,
  {
    amount: 100,
    currency: "USD",
    fundingSourceId: "YOUR_FUNDING_SOURCE_ID",
  },
  {
    idempotencyKey: "deposit-request-001",
  },
);
```

If `fundingSourceId` is omitted, Alvaindes may resolve an eligible funding source according to the API's funding rules.

### Create a withdrawal

```typescript
const withdrawal = await client.withdrawals.create(
  user.id,
  account.id,
  {
    amount: 50,
    currency: "USD",
  },
  {
    idempotencyKey: "withdrawal-request-001",
  },
);
```

Withdrawals are subject to account and available-cash validations.

### List transactions

```typescript
const transactions = await client.transactions.list(user.id, account.id);
```

### Work with broker agreements

```typescript
const requirements = await client.brokerAgreements.getRequirements(
  user.id,
  "YOUR_BROKER_CONNECTION_ID",
);

const accepted = await client.brokerAgreements.accept(
  user.id,
  "YOUR_BROKER_CONNECTION_ID",
  {
    agreement: "account_agreement",
    revision: "1",
  },
);
```

Use the agreement names and revisions returned by the API rather than assuming that the illustrative values above are current requirements.

### Work with broker disclosures

```typescript
const disclosure = await client.brokerDisclosures.create(
  user.id,
  "YOUR_BROKER_CONNECTION_ID",
  {
    employmentStatus: "EMPLOYED",
    employmentSector: "computers_and_it",
    isControlPerson: false,
    isAffiliatedExchangeOrFinra: false,
    isPoliticallyExposed: false,
    immediateFamilyExposed: false,
  },
);
```

### Get a market data quote

```typescript
const quote = await client.marketData.getQuote("AAPL");
```

Market data availability depends on the broker connection and supported provider configuration.

## Idempotency

Orders, deposits, and withdrawals accept an optional `idempotencyKey` in their options.

```typescript
await client.orders.create(
  user.id,
  account.id,
  {
    symbol: "AAPL",
    side: "BUY",
    type: "MARKET",
    quantity: 1,
  },
  {
    idempotencyKey: "unique-request-reference",
  },
);
```

The SDK sends this value using the `Idempotency-Key` HTTP header.

Use a unique key for each logical operation. Reuse the same key when retrying the same request, and do not reuse it for a different operation or different request body.

Idempotency does not mean every uncertain broker outcome is safe to retry. If a financial operation returns an error indicating an uncertain outcome, check its status before attempting another submission.

The SDK does not automatically retry financial operations.

## Error handling

The SDK exposes `AlvaindesError` for API and transport errors.

```typescript
import { Alvaindes, AlvaindesError } from "alvaindes-typescript-sdk";

const client = new Alvaindes({
  apiKey: process.env.ALVAINDES_API_KEY!,
  baseURL: process.env.ALVAINDES_BASE_URL!,
});

try {
  const user = await client.users.get("YOUR_APPLICATION_ID", "YOUR_USER_ID");

  console.log(user);
} catch (error) {
  if (error instanceof AlvaindesError) {
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
  } else {
    throw error;
  }
}
```

`AlvaindesError` provides:

- `status`: HTTP status code, or `0` when no HTTP response was received.
- `message`: Error message.
- `code`: Optional API error code.
- `response`: Optional response details.

Network failures, timeouts, and request cancellation can result in a status of `0`.

## Custom requests

For a public versioned endpoint not yet covered by a resource method, use the client's generic request method.

```typescript
const result = await client.request<YourResponseType>(
  "/v1/your-public-endpoint",
  {
    method: "GET",
  },
);
```

The generic request method also supports request options such as custom headers and an `AbortSignal`.

Only use documented public API endpoints. Internal, administrative, and control-plane endpoints are not supported SDK interfaces.

## Authentication

The SDK authenticates requests using the `x-api-key` HTTP header.

Your API key determines the environment and permissions assigned by Alvaindes. The SDK does not switch environments independently or override API-key permissions.

## API versioning

This SDK targets the public, versioned Alvaindes API under `/v1`.

Internal, administrative, and control-plane endpoints are not part of this SDK.

## Development

Clone the repository and install dependencies:

```bash
npm install
```

Run the checks:

```bash
npm run typecheck
npm test
npm run build
```

## License

MIT. See [LICENSE](./LICENSE).

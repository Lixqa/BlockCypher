# BlockCypher Typesafe Client

A TypeScript client for interacting with BlockCypher's API that provides strong typing and safety when interacting with BlockCypher services. This client simplifies working with the BlockCypher API by providing a type-safe approach to get address balances, block information, and blockchain data and more.

## Features

- **Type Safety**: Fully typed API responses and request options to minimize runtime errors.
- **Coin and Network Handling**: Set coin and network in the constructor, or in specific method calls (but not both).
- **Retry on Rate Limit**: Automatically retries the request if a rate limit error (HTTP 429) occurs.
- **Error Handling**: Detailed error responses with request metadata for easier debugging.

## Installation

To install the client, run the following command:

```bash
npm install blockcypher-client
```

## Example Usage

### Creating a Client Instance

You can create a client instance with the `coin` and `network` specified in the constructor, or leave them out and specify them in the method calls.

#### Example 1: Set Coin and Network in the Constructor

```typescript
import { createBlockCypherClient } from "blockcypher-typesafe-client";

// Create a client with 'eth' as the default coin and 'main' as the default network
const client = createBlockCypherClient({
  token: "your-api-token",
  coin: "eth",
  network: "main"
});

// Get address balance for Ethereum (no need to pass coin and network here)
const response = await client.getAddressBalance("0xAddressHere")

console.log(response);
```

#### Example 2: Specify Coin and Network in Method Call

```typescript
import { createBlockCypherClient } from "blockcypher-client";

// Create a universal client without specifying a coin or network
const client = createBlockCypherClient();

// Specify coin and network in the method call
const response = await client.getAddressBalance("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", {
  coin: "btc",
  network: "main"
});

console.log(response);
```

### Supported Functions

- **Get Address Balance**: Retrieves the balance of an address.
- **Get Blockchain Info**: Retrieves general information about the blockchain.
- **Get Block**: Retrieves information about a specific block using either a block hash or height.

### Example with Get Address Balance

```typescript
client.getAddressBalance("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", {
  coin: "btc",
  network: "main"
}).then(response => {
  console.log(response);
});
```

### Example with Get BlockChain Info

```typescript
client.getBlockChainInfo({
  coin: "eth",
  network: "main"
}).then(response => {
  console.log(response);
});
```

### Example with Get Block

```typescript
client.getBlock("00000000000000000007695bb828d9c9182ac6587b9023c576fe24c325f9c03", {
  coin: "btc",
  network: "main"
}).then(response => {
  console.log(response);
});
```

## Error Handling

The client throws a custom `ApiError` in case of failed requests. You can catch the errors like this:

```typescript
try {
  await client.getAddressBalance("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", {
    coin: "btc",
    network: "main"
  });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error occurred: ${error.status} - ${error.statusText}`);
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

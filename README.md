# 🚀 BlockCypher TypeScript Client

[![npm version](https://img.shields.io/npm/v/blockcypher-client.svg)](https://www.npmjs.com/package/blockcypher-client)
[![GitHub](https://img.shields.io/github/stars/Lixqa/BlockCypher?style=social)](https://github.com/Lixqa/BlockCypher)

A modern, type-safe, and ergonomic TypeScript SDK for the [BlockCypher](https://www.blockcypher.com/dev/bitcoin/) blockchain API. Effortlessly interact with Bitcoin, Ethereum, Litecoin, Dogecoin, Dash, and more—whether you need REST or real-time WebSocket events.

---

## ✨ Features

- **Type Safety**: All API responses and requests are fully typed for confidence and autocompletion.
- **Flexible Coin/Network Handling**: Set defaults in the client or per-request—never both.
- **Automatic Rate Limit Retries**: Handles HTTP 429 with exponential backoff.
- **WebSocket Events**: Real-time blockchain events with auto-reconnect and ergonomic listeners.
- **Debug Logging**: All requests, responses, errors, and WebSocket events are logged for easy troubleshooting.
- **Rich Error Handling**: Custom `ApiError` with full context.

---

## ⚡ Quickstart

```bash
npm install blockcypher-client
```

```typescript
import { createBlockCypherClient } from 'blockcypher-client';

const client = createBlockCypherClient({
  token: 'your-api-token',
  coin: 'btc',
  network: 'main',
});

const balance = await client.getAddressBalance('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
console.log(balance);
```

---

## 🛠️ Usage

### 1. Client Creation

**With Defaults:**

```typescript
const client = createBlockCypherClient({ token, coin: 'eth', network: 'main' });
```

**Per-Request:**

```typescript
const client = createBlockCypherClient();
const info = await client.getBlockChainInfo({ coin: 'btc', network: 'test3' });
```

### 2. Core REST Methods

- `getAddressBalance(address[, options])`
- `getBlockChainInfo([options])`
- `getBlock(hashOrHeight[, options])`
- `getAddress(address[, options])`
- `getTransaction(hash[, options])`
- `getTransactionConfidence(hash[, options])`

**Example:**

```typescript
const block = await client.getBlock('000000...', {
  coin: 'btc',
  network: 'main',
});
```

---

## 🔔 Real-Time WebSocket Events

### Effortless Subscriptions

**String Form (when client has all options):**

```typescript
client.on('new-block', (block) => {
  console.log('New block:', block);
});
```

**Object Form (specify per-event):**

```typescript
client.on(
  {
    coin: 'btc',
    network: 'main',
    token: 'your-api-token',
    event: 'new-block',
  },
  (block) => {
    console.log('New block:', block);
  },
);
```

**Remove or Once:**

```typescript
client.off("new-block", handler);
client.once("double-spend-tx", (tx) => { ... });
```

### Supported Events

- `unconfirmed-tx`
- `confirmed-tx`
- `new-block`
- `double-spend-tx`
- `ping`

### 🔄 Auto-Reconnect

If the WebSocket connection drops, the client will automatically reconnect with exponential backoff and re-subscribe to your events. All registered callbacks are restored.

---

## 🧑‍💻 Advanced: Type Safety & Typings

All types are exported from the package root:

```typescript
import type { Coin, Network, WebSocketEventType, WebSocketEventParams } from 'blockcypher-client';
```

---

## 🐞 Debugging & Logging

All API and WebSocket activity is logged with `console.debug`:

- Requests, responses, errors, retries
- WebSocket connects, disconnects, reconnects, messages, and errors

---

## 📦 Links

- [GitHub Repository](https://github.com/Lixqa/BlockCypher)
- [NPM Package](https://www.npmjs.com/package/blockcypher-client)
- [BlockCypher API Docs](https://www.blockcypher.com/dev/bitcoin/)

---

## 📚 License

MIT

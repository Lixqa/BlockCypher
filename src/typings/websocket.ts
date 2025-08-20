import { BlockMap } from './api-response-mappings';
import { TransactionMap } from './api-response-mappings';
import { Coin, Network } from './types';

export type WebSocketConnectionOptions<TCoin extends Coin, TEvent extends WebSocketEventType> = {
  token: string;
  coin: TCoin;
  network: Network;
  event: TEvent;
};

export type WebSocketEventPayloads<TCoin extends Coin> = {
  'unconfirmed-tx': TransactionMap[TCoin];
  'confirmed-tx': TransactionMap[TCoin];
  'new-block': BlockMap[TCoin];
  'double-spend-tx': TransactionMap[TCoin];
  ping: { event: 'pong' };
};

export type WebSocketEventType = keyof WebSocketEventPayloads<Coin>;

export type WebSocketEventCallback<TCoin extends Coin, TEvent extends WebSocketEventType> = (
  data: WebSocketEventPayloads<TCoin>[TEvent],
) => void;

export type WebSocketEventCallbacks<TCoin extends Coin> = {
  [K in keyof WebSocketEventPayloads<TCoin>]?: Array<
    (data: WebSocketEventPayloads<TCoin>[K]) => void
  >;
};

export type WebSocketEventParams<
  TCoin extends Coin | undefined,
  TNetwork extends Network | undefined,
  TToken extends string | undefined,
  TEvent extends WebSocketEventType,
> = TCoin extends Coin
  ? TNetwork extends Network
    ? TToken extends string
      ? { event: TEvent }
      : { token: string; event: TEvent }
    : TToken extends string
      ? { network: Network; event: TEvent }
      : { token: string; network: Network; event: TEvent }
  : TNetwork extends Network
    ? TToken extends string
      ? { coin: Coin; event: TEvent }
      : { token: string; coin: Coin; event: TEvent }
    : TToken extends string
      ? { coin: Coin; network: Network; event: TEvent }
      : { token: string; coin: Coin; network: Network; event: TEvent };

import { SUPPORTED_COIN_NETWORKS } from "../constants";

export type BlockCypherOptions = {
    token?: string;
    coin?: Coin;
    network?: Network;
    version?: number;
    userAgent?: string;
    rateLimitRetries?: number;
};

export type RequestOptions = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    query?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
    coin?: Coin;
    network?: Network;
    _currentRateLimitRetryAttempt?: number;
};

export type Coin = keyof typeof SUPPORTED_COIN_NETWORKS;

export type Network = typeof SUPPORTED_COIN_NETWORKS[Coin][number];

export type ChainOptions<Override extends Coin | undefined = undefined> = 
  Override extends Coin
    ? { coin: Override; network: Network }
    : { coin?: Coin; network?: Network };

export type ResolveCoin<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined
> = MethodCoin extends Coin
  ? MethodCoin
  : ConstructorCoin extends Coin
    ? ConstructorCoin
    : never;

export type MethodResponse<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined,
  MapT extends Record<string, any>
> =
  ResolveCoin<ConstructorCoin, MethodCoin> extends never
    ? never
    : MapT[ResolveCoin<ConstructorCoin, MethodCoin>];

export type MethodParams<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined,
  Params extends any[]
> =
  ConstructorCoin extends Coin
    ? Params
    : [...Params, chain: ChainOptions<MethodCoin>];
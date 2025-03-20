import { AddressBalanceResponseMap } from "./api-response-types";

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

export type Coin = "btc" | "eth" | "dash" | "doge" | "ltc" | "bcy";

export type Network = "main" | "test3" | "test";

export type ChainOptions<Override extends Coin | undefined = undefined> = 
  Override extends Coin
    ? { coin: Override; network: Network }
    : { coin?: Coin; network?: Network };

export type AddressBalanceResponse<T extends Coin> = AddressBalanceResponseMap[T];

export type ResolveCoin<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined
> = MethodCoin extends Coin
  ? MethodCoin
  : ConstructorCoin extends Coin
    ? ConstructorCoin
    : never;

export type ResolveMethodResponse<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined,
  MapT extends Record<string, any>
> =
  ResolveCoin<ConstructorCoin, MethodCoin> extends never
    ? never
    : MapT[ResolveCoin<ConstructorCoin, MethodCoin>];

export type AddressBalanceMethodParams<ConstructorCoin extends Coin | undefined> =
  ConstructorCoin extends Coin
    ? (
        address: string
      ) => Promise<ResolveMethodResponse<ConstructorCoin, undefined, AddressBalanceResponseMap>>
    : <
        TChain extends ChainOptions
      >(
        address: string,
        chain: TChain
      ) => Promise<ResolveMethodResponse<undefined, ExtractCoin<TChain>, AddressBalanceResponseMap>>;

export type ResolveChainOptionsInput<
  MethodCoin,
  ConstructorCoin
> =
  MethodCoin extends Coin
    ? { coin: MethodCoin; network: Network }
    : ConstructorCoin extends Coin
      ? Partial<{ coin: ConstructorCoin; network: Network }>
      : never;

export type Flatten<T> = {
    [K in keyof T]: T[K];
};

export type InferMethodCoin<TChain> =
  TChain extends { coin: infer C } ? C & Coin : undefined;

export type ExtractCoin<T> = T extends { coin: infer C } ? C : never;

export type AddressBalanceParams<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined
> =
  ConstructorCoin extends Coin
    ? [address: string]
    : [address: string, chain: ChainOptions<MethodCoin>];

export type BlockChainInfoParams<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined
> =
  ConstructorCoin extends Coin
    ? []
    : [chain: ChainOptions<MethodCoin>];

export type BlockParams<
  ConstructorCoin extends Coin | undefined,
  MethodCoin extends Coin | undefined
> =
  ConstructorCoin extends Coin
    ? [hashOrHeigth: string]
    : [hashOrHeigth: string, chain: ChainOptions<MethodCoin>];


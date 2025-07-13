import { SUPPORTED_COIN_NETWORKS } from "./constants";
import { ApiError } from "./errors/api";
import { AddressBalanceMap, AddressMap, BlockChainInfoMap, BlockMap, TransactionMap } from "./typings/api-response-mappings";
import { TransactionConfidence } from "./typings/api-response-types";
import { BlockCypherOptions, Coin, RequestOptions, MethodResponse, MethodParams, Network } from "./typings/types";
import { WebSocketEventCallback, WebSocketEventType, WebSocketEventParams } from "./typings/websocket";
import { WebSocketConnectionManager, mergeWebSocketParams } from "./websocket";

export function createBlockCypherClient<
  TCoin extends Coin | undefined = undefined,
  TNetwork extends Network | undefined = undefined,
  TToken extends string | undefined = undefined
>(
  options?: BlockCypherOptions & { coin?: TCoin; network?: TNetwork; token?: TToken }
): BlockCypherClient<TCoin, TNetwork, TToken> {
  return new BlockCypherClient<TCoin, TNetwork, TToken>(options);
}

class BlockCypherClient<
  TCoin extends Coin | undefined = undefined,
  TNetwork extends Network | undefined = undefined,
  TToken extends string | undefined = undefined
> {
  private baseUrl = "https://api.blockcypher.com/v1";
  private options: BlockCypherOptions;

  constructor(options?: BlockCypherOptions & { coin?: TCoin; network?: TNetwork; token?: TToken }) {
    if (options != null) {
      this.options = options;
    } else {
      this.options = {};
    }
  }

    private async request(path: string, options: Exclude<RequestOptions, "_currentRateLimitRetryAttempt">): Promise<any> {
        const coin = this.options.coin || options.coin;
        const network = this.options.network || options.network;

        // ###################################################

        if (!coin) {
            console.debug("[API] Error: Coin is required");
            throw new Error("Coin is required");
        }

        if (!network) {
            console.debug("[API] Error: Network is required");
            throw new Error("Network is required");
        }

        if (this.options.coin && options.coin) {
            console.debug("[API] Error: Coin is already set in the constructor");
            throw new Error("Coin is already set in the constructor");
        }

        if (this.options.network && options.network) {
            console.debug("[API] Error: Network is already set in the constructor");
            throw new Error("Network is already set in the constructor");
        }

        if (!(SUPPORTED_COIN_NETWORKS[coin] as any).includes(network)) {
            console.debug(`[API] Error: Network ${network} is not supported for coin ${coin}`);
            throw new Error(`Network ${network} is not supported for coin ${coin}`);
        }

        // ###################################################

        if (this.options.token) options.query = { token: this.options.token, ...options.query };

        const query = new URLSearchParams(options.query);

        const url = `${this.baseUrl}/${coin}/${network}/${path}${query ? `?${query}` : ""}`;

        const headers = {
            "Content-Type": "application/json",
            "User-Agent": this.options?.userAgent || "blockcypher-client-lixqa",
            ...options.headers
        };

        console.debug(`[API] Request: ${options.method} ${url}`);
        if (options.body) {
            console.debug(`[API] Request Body:`, options.body);
        }
        if (Object.keys(headers).length > 0) {
            console.debug(`[API] Request Headers:`, headers);
        }

        try {
            const response = await fetch(url, {
                method: options.method,
                headers,
                body: JSON.stringify(options.body)
            });

            if (!response.ok) {
                if (response.status === 429) {
                    if (options._currentRateLimitRetryAttempt === undefined) {
                        options._currentRateLimitRetryAttempt = 1;
                    } else {
                        options._currentRateLimitRetryAttempt++;
                    }

                    if (options._currentRateLimitRetryAttempt <= (this.options.rateLimitRetries || 3)) {
                        const retryAfter = response.headers.get("retry-after") ? Number(response.headers.get("retry-after")) * 1000 : options._currentRateLimitRetryAttempt! * 1000;
                        
                        console.debug(`[API] Rate limit hit. Retrying after ${retryAfter}ms (attempt ${options._currentRateLimitRetryAttempt})`);
                        
                        await new Promise(resolve => setTimeout(resolve, retryAfter));
                        
                        return this.request(path, options);
                    }
                }

                let errorBody;
                try {
                    errorBody = await response.json();
                } catch (e) {
                    errorBody = await response.text();
                }
                console.debug(`[API] Error Response:`, {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    body: errorBody
                });
                throw new ApiError({
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    body: errorBody
                });
            }

            const data = await response.json();
            console.debug(`[API] Response:`, data);
            return data;
        } catch (err) {
            console.debug(`[API] Request failed:`, err);
            throw err;
        }
    }

    async getAddressBalance<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<TCoin, MethodCoin, [ address: string ]>
      ): Promise<MethodResponse<TCoin, MethodCoin, AddressBalanceMap>> {
        const [ address, maybeChain ] = args;
      
        return this.request(`addrs/${address}/balance`, {
          method: "GET",
          ...(maybeChain || {}),
        });
    }

    async getBlockChainInfo<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<TCoin, MethodCoin, []>
    ): Promise<MethodResponse<TCoin, MethodCoin, BlockChainInfoMap>> {
        const [ maybeChain ] = args;

        return this.request("", {
            method: "GET",
            ...maybeChain
        });
    }

    async getBlock<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<TCoin, MethodCoin, [ blockHashOrHeight: string ]>
    ): Promise<MethodResponse<TCoin, MethodCoin, BlockMap>> {
        const [ blockHashOrHeight, maybeChain ] = args;

        return this.request(`blocks/${blockHashOrHeight}`, {
            method: "GET",
            ...maybeChain
        });
    }

    async getAddress<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<TCoin, MethodCoin, [ address: string ]>
    ): Promise<MethodResponse<TCoin, MethodCoin, AddressMap>> {
        const [ address, maybeChain ] = args;

        return this.request(`addrs/${address}`, {
            method: "GET",
            ...(maybeChain || {})
        });
    }

    async getTransaction<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<TCoin, MethodCoin, [ hash: string ]>
    ): Promise<MethodResponse<TCoin, MethodCoin, TransactionMap>> {
        const [ hash, maybeChain ] = args;

        return this.request(`txs/${hash}`, {
            method: "GET",
            ...(maybeChain || {})
        });
    }

    async getTransactionConfidence<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<TCoin, MethodCoin, [ hash: string ]>
    ): Promise<TransactionConfidence> {
        const [ hash, maybeChain ] = args;

        return this.request(`txs/${hash}/confidence`, {
            method: "GET",
            ...(maybeChain || {})
        });
    }

  on<TEvent extends WebSocketEventType>(
    params: WebSocketEventParams<TCoin, TNetwork, TToken, TEvent> | TEvent,
    callback: WebSocketEventCallback<TCoin extends Coin ? TCoin : Coin, TEvent>
  ) {
    const merged = mergeWebSocketParams(params, this.options);

    console.debug(`[Client] Registering callback for event '${merged.event}' on ${merged.coin}/${merged.network} (token: ${!!merged.token})`);
    
    WebSocketConnectionManager.getConnection(merged).on(callback as any);
  }

  off<TEvent extends WebSocketEventType>(
    params: WebSocketEventParams<TCoin, TNetwork, TToken, TEvent> | TEvent,
    callback: WebSocketEventCallback<TCoin extends Coin ? TCoin : Coin, TEvent>
  ) {
    const merged = mergeWebSocketParams(params, this.options);
    
    console.debug(`[Client] Removing callback for event '${merged.event}' on ${merged.coin}/${merged.network} (token: ${!!merged.token})`);
    
    WebSocketConnectionManager.getConnection(merged).off(callback as any);
  }

  once<TEvent extends WebSocketEventType>(
    params: WebSocketEventParams<TCoin, TNetwork, TToken, TEvent> | TEvent,
    callback: WebSocketEventCallback<TCoin extends Coin ? TCoin : Coin, TEvent>
  ) {
    const merged = mergeWebSocketParams(params, this.options);
    
    console.debug(`[Client] Registering once-callback for event '${merged.event}' on ${merged.coin}/${merged.network} (token: ${!!merged.token})`);
    
    WebSocketConnectionManager.getConnection(merged).once(callback as any);
  }
}
import { ApiError } from "./errors/api";
import { AddressBalanceResponseMap, AddressResponseMap, BlockChainInfoResponseMap, BlockResponseMap } from "./typings/api-response-types";
import { BlockCypherOptions, Coin, RequestOptions, MethodResponse, MethodParams } from "./typings/types";

export function createBlockCypherClient<TCoin extends Coin | undefined = undefined>(
    options?: BlockCypherOptions & { coin?: TCoin }
  ): BlockCypherClient<TCoin> {
    return new BlockCypherClient<TCoin>(options);
}

class BlockCypherClient<ConstructorCoin extends Coin | undefined = undefined> {
    private baseUrl = "https://api.blockcypher.com/v1";
    private options: BlockCypherOptions;

    constructor(options?: BlockCypherOptions) {
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
    }

    private async request(path: string, options: Exclude<RequestOptions, "_currentRateLimitRetryAttempt">): Promise<any> {
        const coin = options.coin || this.options.coin;
        const network = options.network || this.options.network;

        // ###################################################

        if (!coin) {
            throw new Error("Coin is required");
        }

        if (!network) {
            throw new Error("Network is required");
        }

        if (this.options.coin && options.coin) {
            throw new Error("Coin is already set in the constructor");
        }

        if (this.options.network && options.network) {
            throw new Error("Network is already set in the constructor");
        }

        // ###################################################

        const query = new URLSearchParams(options.query);

        const url = `${this.baseUrl}/${coin}/${network}/${path}${query ? `?${query}` : ""}`;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": this.options?.token ? `Bearer ${this.options.token}` : "",
            "User-Agent": this.options?.userAgent || "blockcypher-client-lixqa",
            ...options.headers
        };

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
                    await new Promise(resolve => setTimeout(resolve, response.headers.get("retry-after") ? Number(response.headers.get("retry-after")) * 1000 : options._currentRateLimitRetryAttempt! * 1000));
                    return this.request(path, options);
                }
            }

            throw new ApiError({
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                body: await response.json()
            });
        }

        return response.json();
    }

    async getAddressBalance<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<ConstructorCoin, MethodCoin, [ address: string ]>
      ): Promise<MethodResponse<ConstructorCoin, MethodCoin, AddressBalanceResponseMap>> {
        const [ address, maybeChain ] = args;
      
        return this.request(`addrs/${address}/balance`, {
          method: "GET",
          ...(maybeChain || {}),
        });
    }

    async getBlockChainInfo<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<ConstructorCoin, MethodCoin, []>
    ): Promise<MethodResponse<ConstructorCoin, MethodCoin, BlockChainInfoResponseMap>> {
        const [ maybeChain ] = args;

        return this.request("", {
            method: "GET",
            ...maybeChain
        });
    }

    async getBlock<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<ConstructorCoin, MethodCoin, [ blockHashOrHeight: string ]>
    ): Promise<MethodResponse<ConstructorCoin, MethodCoin, BlockResponseMap>> {
        const [ blockHashOrHeight, maybeChain ] = args;

        return this.request(`blocks/${blockHashOrHeight}`, {
            method: "GET",
            ...maybeChain
        });
    }

    async getAddress<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<ConstructorCoin, MethodCoin, [ address: string ]>
    ): Promise<MethodResponse<ConstructorCoin, MethodCoin, AddressResponseMap>> {
        const [ address, maybeChain ] = args;

        return this.request(`addrs/${address}`, {
            method: "GET",
            ...(maybeChain || {})
        });
    }

    async getTransaction<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<ConstructorCoin, MethodCoin, [ hash: string ]>
    ): Promise<MethodResponse<ConstructorCoin, MethodCoin, any>> {
        const [ hash, maybeChain ] = args;

        return this.request(`txs/${hash}`, {
            method: "GET",
            ...(maybeChain || {})
        });
    }

    async getTransactionConfidence<MethodCoin extends Coin | undefined = undefined>(
        ...args: MethodParams<ConstructorCoin, MethodCoin, [ hash: string ]>
    ): Promise<MethodResponse<ConstructorCoin, MethodCoin, any>> {
        const [ hash, maybeChain ] = args;

        return this.request(`txs/${hash}/confidence`, {
            method: "GET",
            ...(maybeChain || {})
        });
    }
}
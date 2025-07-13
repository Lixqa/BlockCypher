import { WebSocket as WebSocketClient } from "ws";
import { Coin, Network } from "./typings/types";
import {
  WebSocketEventPayloads,
  WebSocketEventType,
  WebSocketEventCallback,
  WebSocketConnectionOptions
} from "./typings/websocket";

export function mergeWebSocketParams<TEvent extends WebSocketEventType>(
  params: TEvent | { token?: string; coin?: Coin; network?: Network; event: TEvent },
  options: { token?: string; coin?: Coin; network?: Network }
): { token: string; coin: Coin; network: Network; event: TEvent } {
  let merged: { token: string; coin: Coin; network: Network; event: TEvent };

  if (typeof params === "string") {
    merged = {
      token: options.token!,
      coin: options.coin!,
      network: options.network!,
      event: params as TEvent,
    };

    if (!merged.token || !merged.coin || !merged.network) {
      throw new Error("When using the string event form, token, coin, and network must be set in the client options.");
    }
  } else {
    merged = {
      token: params.token ?? options.token!,
      coin: params.coin ?? options.coin!,
      network: params.network ?? options.network!,
      event: params.event,
    };

    if (!merged.token || !merged.coin || !merged.network) {
      throw new Error("Missing token, coin, or network for websocket event registration");
    }
  }

  return merged;
}

export class WebSocketConnectionManager {
    private static connections: Map<string, WebSocketConnection<any, any>> = new Map();

    static getConnection<TCoin extends Coin, TEvent extends WebSocketEventType>(
        options: WebSocketConnectionOptions<TCoin, TEvent>
    ): WebSocketConnection<TCoin, TEvent> {
        const key = `${options.token}|${options.coin}|${options.network}|${options.event}`;

        if (!this.connections.has(key)) {
            console.debug(`[WebSocketManager] Creating new connection for event '${options.event}' on ${options.coin}/${options.network} (token: ${!!options.token})`);
            
            this.connections.set(key, new WebSocketConnection(options));
        } else {
            console.debug(`[WebSocketManager] Reusing existing connection for event '${options.event}' on ${options.coin}/${options.network} (token: ${!!options.token})`);
        }

        return this.connections.get(key) as WebSocketConnection<TCoin, TEvent>;
    }
}

export default class WebSocketConnection<TCoin extends Coin, TEvent extends WebSocketEventType> {
  private baseUrl = "https://socket.blockcypher.com/v1";
  private websocketClient?: WebSocketClient;
  private callbacks: Array<WebSocketEventCallback<TCoin, TEvent>> = [];
  private ready = Promise.withResolvers<void>();
  private reconnectAttempts = 0;
  private reconnecting = false;
  private closedByUser = false;
  private options: WebSocketConnectionOptions<TCoin, TEvent>;

  constructor(options: WebSocketConnectionOptions<TCoin, TEvent>) {
    this.options = options;
    
    this.connect();
  }

  private connect() {
    const url = `${this.baseUrl}/${this.options.coin}/${this.options.network}?token=${this.options.token}`;

    this.websocketClient = new WebSocketClient(url);

    this.ready = Promise.withResolvers<void>();

    this.closedByUser = false;

    console.debug(`[WebSocket] Connecting to ${url}`);

    this.websocketClient?.on("open", () => {
      console.debug(`[WebSocket] Connection opened for event '${this.options.event}' on ${this.options.coin}/${this.options.network}`);

      this.reconnectAttempts = 0;
      this.reconnecting = false;

      this.ready.resolve();

      this.send(this.options.event);

      this.websocketClient?.on("message", buffer => {
        const message = JSON.parse(buffer.toString());

        console.debug(`[WebSocket] Message received for event '${this.options.event}' on ${this.options.coin}/${this.options.network}:`, message);
        
        if (message && message.event === 'events limit reached') {
          console.debug(`[WebSocket] Error: Events limit reached`);

          throw new Error("Blockcypher events limit reached. You may change your token or upgrade.");
        }

        this.callbacks.forEach(cb => cb(message as WebSocketEventPayloads<TCoin>[TEvent]));
      });
    });

    this.websocketClient?.on("close", () => {
      console.debug(`[WebSocket] Connection closed for event '${this.options.event}' on ${this.options.coin}/${this.options.network}`);

      if (!this.closedByUser) this.handleReconnect();
    });
    this.websocketClient?.on("error", (err) => {
      console.debug(`[WebSocket] Error for event '${this.options.event}' on ${this.options.coin}/${this.options.network}:`, err);

      if (!this.closedByUser) this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnecting) return;

    this.reconnecting = true;
    this.reconnectAttempts++;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);

    console.debug(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.closedByUser) return;

      console.debug(`[WebSocket] Reconnecting...`);

      this.connect();
    }, delay);
  }

  send(event: TEvent) {
    this.ready.promise.then(() => {
      this.websocketClient?.send(JSON.stringify({ event }));

      console.debug(`[WebSocket] Sent subscription for event '${event}'`);
    });
  }

  on(callback: WebSocketEventCallback<TCoin, TEvent>) {
    this.callbacks.push(callback);

    console.debug(`[WebSocket] Callback registered for event`);
  }

  off(callback: WebSocketEventCallback<TCoin, TEvent>) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);

    console.debug(`[WebSocket] Callback removed for event`);
  }

  once(callback: WebSocketEventCallback<TCoin, TEvent>) {
    const onceCallback: WebSocketEventCallback<TCoin, TEvent> = (data) => {
      this.off(onceCallback);

      callback(data);
    };

    this.on(onceCallback);

    console.debug(`[WebSocket] Once callback registered for event`);
  }

  close() {
    this.closedByUser = true;
    
    this.websocketClient?.close();

    console.debug(`[WebSocket] Connection closed by user`);
  }
}
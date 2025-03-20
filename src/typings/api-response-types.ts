export type BitcoinAddressBalanceResponse = Exclude<BitcoinAddress, "tx_url" | "txrefs" | "unconfirmed_txrefs">;
export type EthereumAddressBalanceResponse = Exclude<EthereumAddress, "tx_url" | "txrefs" | "unconfirmed_txrefs">;
export type LitecoinAddressBalanceResponse = BitcoinAddressBalanceResponse;
export type DogecoinAddressBalanceResponse = BitcoinAddressBalanceResponse;
export type DashAddressBalanceResponse = BitcoinAddressBalanceResponse;
export type BlockCypherAddressBalanceResponse = BitcoinAddressBalanceResponse;

export type AddressBalanceResponseMap = {
    "btc": BitcoinAddressBalanceResponse;
    "eth": EthereumAddressBalanceResponse;
    "ltc": LitecoinAddressBalanceResponse;
    "doge": DogecoinAddressBalanceResponse;
    "dash": DashAddressBalanceResponse;
    "bcy": BlockCypherAddressBalanceResponse;
}



export type BaseBlockChainInfoResponse = {
    name: string;
    height: number;
    hash: string;
    time: string;
    latest_url: string;
    previous_hash: string;
    previous_url: string;
    peer_count: number;
    unconfirmed_count: number;
    last_fork_height: number;
    last_fork_hash: string;
};
export type BitcoinBlockChainInfoResponse = BaseBlockChainInfoResponse & {
    high_fee_per_kb: number;
    medium_fee_per_kb: number;
    low_fee_per_kb: number;
};
export type EthereumBlockChainInfoResponse = BaseBlockChainInfoResponse & {
    high_gas_price: number;
    medium_gas_price: number;
    low_gas_price: number;
    high_priority_fee: number;
    medium_priority_fee: number;
    low_priority_fee: number;
    base_fee: number;
};
export type LitecoinBlockChainInfoResponse = BitcoinBlockChainInfoResponse;
export type DogecoinBlockChainInfoResponse = BitcoinBlockChainInfoResponse;
export type DashBlockChainInfoResponse = BitcoinBlockChainInfoResponse;
export type BlockCypherBlockChainInfoResponse = BitcoinBlockChainInfoResponse;

export type BlockChainInfoResponseMap = {
    "btc": BitcoinBlockChainInfoResponse;
    "eth": EthereumBlockChainInfoResponse;
    "ltc": LitecoinBlockChainInfoResponse;
    "doge": DogecoinBlockChainInfoResponse;
    "dash": DashBlockChainInfoResponse;
    "bcy": BlockCypherBlockChainInfoResponse;
}



export type BaseBlockResponse = {
    hash: string;
    height: number;
    chain: string;
    total: number;
    fees: number;
    size: number;
    ver: number;
    time: string;
    received_time: string;
    relayed_by: string;
    nonce: number;
    n_tx: number;
    prev_block: string;
    mrkl_root: string;
    txids: string[];
    depth: number;
    prev_block_url: string;
    tx_url: string;
};
export type BitcoinBlockResponse = BaseBlockResponse & {
    vsize: number;
};
export type EthereumBlockResponse = BaseBlockResponse & {
    coinbase_addr: string;
};
export type LitecoinBlockResponse = BitcoinBlockResponse;
export type DogeBlockResponse = Omit<BitcoinBlockResponse, "vsize">;
export type DashBlockResponse = DogeBlockResponse;
export type BlockCypherBlockResponse = BitcoinBlockResponse;

export type BlockResponseMap = {
    "btc": BitcoinBlockResponse;
    "eth": EthereumBlockResponse;
    "ltc": LitecoinBlockResponse;
    "doge": DogeBlockResponse;
    "dash": DashBlockResponse;
    "bcy": BlockCypherBlockResponse;
}



export type BaseTxRef = {
    tx_hash: string;
    block_height: number;
    tx_input_n: number;
    tx_output_n: number;
    value: number;
    ref_balance: number;
    spent: boolean;
    spent_by: string;
    confirmations: number;
    confirmed: string;
    double_spend: boolean;
    preference: string;
}
export type BitcoinTxRef = BaseTxRef;
export type EthereumTxRef = BaseTxRef;
export type LitecoinTxRef = BaseTxRef;
export type DogecoinTxRef = BaseTxRef;
export type DashTxRef = BaseTxRef;
export type BlockCypherTxRef = BaseTxRef;



export type BaseAddress = {
    address: string;
    total_received: number;
    total_sent: number;
    balance: number;
    unconfirmed_balance: number;
    final_balance: number;
    n_tx: number;
    unconfirmed_n_tx: number;
    final_n_tx: number;
    txrefs: BaseTxRef[];
    unconfirmed_txrefs: (BaseTxRef & { preference: string })[];
    tx_url: string;
}
export type BitcoinAddress = BaseAddress;
export type EthereumAddress = BaseAddress & {
    nonce: number;
    pool_nonce: number;
};
export type LitecoinAddress = BitcoinAddress;
export type DogecoinAddress = BitcoinAddress;
export type DashAddress = BitcoinAddress;
export type BlockCypherAddress = BitcoinAddress;

export type AddressResponseMap = {
    "btc": BitcoinAddress;
    "eth": EthereumAddress;
    "ltc": LitecoinAddress;
    "doge": DogecoinAddress;
    "dash": DashAddress;
    "bcy": BlockCypherAddress;
}
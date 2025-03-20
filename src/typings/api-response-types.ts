export type BitcoinAddressBalanceResponse = {
    address: string;
    total_received: number;
    total_sent: number;
    balance: number;
    unconfirmed_balance: number;
    final_balance: number;
    n_tx: number;
    unconfirmed_n_tx: number;
    final_n_tx: number;
};
export type EthereumAddressBalanceResponse = {
    address: string;
    total_received: number;
    total_sent: number;
    balance: number;
    unconfirmed_balance: number;
    final_balance: number;
    n_tx: number;
    unconfirmed_n_tx: number;
    final_n_tx: number;
    nonce: number;
    pool_nonce: number;
};
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



export type BaseBlock = {
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
export type BitcoinBlock = BaseBlock & {
    vsize: number;
};
export type EthereumBlock = BaseBlock & {
    coinbase_addr: string;
};
export type LitecoinBlock = BitcoinBlock;
export type DogeBlock = Omit<BitcoinBlock, "vsize">;
export type DashBlock = DogeBlock;
export type BlockCypherBlock = BitcoinBlock;

export type BlockResponseMap = {
    "btc": BitcoinBlock;
    "eth": EthereumBlock;
    "ltc": LitecoinBlock;
    "doge": DogeBlock;
    "dash": DashBlock;
    "bcy": BlockCypherBlock;
}
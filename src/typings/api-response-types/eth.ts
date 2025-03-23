export type ETHTransaction = {
    block_hash: string;
    block_height: number;
    block_index: number;
    hash: string;
    addresses: string[];
    total: number;
    fees: number;
    size: number;
    gas_limit: number;
    gas_used: number;
    gas_price: number;
    gas_tip_cap: number;
    gas_fee_cap: number;
    confirmed: string;
    received: string;
    ver: number;
    double_spend: boolean;
    vin_sz: number;
    vout_sz: number;
    internal_txids: string[];
    confirmations: number;
    confidence: number;
    inputs: ETHTransactionInput[];
    outputs: ETHTransactionOutput[];
}

export type ETHTransactionInput = {
    sequence: number;
    addresses: string[];
}

export type ETHTransactionOutput = {
    value: number;
    script: string;
    addresses: string[];
}

export type ETHBlockChainInfo = {
    name: string;
    height: number;
    hash: string;
    time: string;
    latest_url: string;
    previous_hash: string;
    previous_url: string;
    peer_count: number;
    unconfirmed_count: number;
    high_gas_price: number;
    medium_gas_price: number;
    low_gas_price: number;
    high_priority_fee: number;
    medium_priority_fee: number;
    low_priority_fee: number;
    base_fee: number;
    last_fork_height: number;
    last_fork_hash: string;
}

export type ETHAddress = {
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
    txrefs: ETHTxRef[];
    unconfirmed_txrefs: ETHTxRef[];
    hasMore: boolean;
    tx_url: string;
}

export type ETHTxRef = {
    tx_hash: string;
    block_height: number;
    tx_input_n: number;
    tx_output_n: number;
    value: number;
    ref_balance: number;
    confirmations: number;
    confirmed: string;
    double_spend: boolean;
}

export type ETHAddressBalance = Omit<ETHAddress, "txrefs" | "unconfirmed_txrefs" | "hasMore" | "tx_url">;

export type ETHBlock = {
    hash: string;
    height: number;
    chain: string;
    total: number;
    fees: number;
    size: number;
    ver: number;
    time: string;
    received_time: string;
    coinbase_addr: string;
    relayed_by: string;
    nonce: number;
    n_tx: number;
    prev_block: string;
    mrkl_root: string;
    txids: string[];
    depth: number;
    prev_block_url: string;
    tx_url: string;
}
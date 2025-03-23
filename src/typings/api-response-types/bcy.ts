export type BCYTransaction = {
    block_hash: string;
    block_height: number;
    block_index: number;
    hash: string;
    addresses: string[];
    total: number;
    fees: number;
    size: number;
    vsize: number;
    preference: string;
    confirmed: string;
    received: string;
    ver: number;
    double_spend: boolean;
    vin_sz: number;
    vout_sz: number;
    opt_in_rbf: boolean;
    data_protocol: string;
    confirmations: number;
    confidence: number;
    inputs: BCYTransactionInput[];
    outputs: BCYTransactionOutput[];
}

export type BCYTransactionInput = {
    output_index: number;
    script: string;
    sequence: number;
    script_type: string;
    age: number;
}

export type BCYTransactionOutput = {
    value: number;
    script: string;
    addresses: string[];
    script_type: string;
}

export type BCYBlockChainInfo = {
    name: string;
    height: number;
    hash: string;
    time: string;
    latest_url: string;
    previous_hash: string;
    previous_url: string;
    peer_count: number;
    unconfirmed_count: number;
    high_fee_per_kb: number;
    medium_fee_per_kb: number;
    low_fee_per_kb: number;
    last_fork_height: number;
    last_fork_hash: string;
}

export type BCYAddress = {
    address: string;
    total_received: number;
    total_sent: number;
    balance: number;
    unconfirmed_balance: number;
    final_balance: number;
    n_tx: number;
    unconfirmed_n_tx: number;
    final_n_tx: number;
    txrefs: BCYTxRef[];
    unconfirmed_txrefs: BCYTxRef[];
    hasMore: boolean;
    tx_url: string;
}

export type BCYTxRef = {
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
}

export type BCYAddressBalance = Omit<BCYAddress, "txrefs" | "unconfirmed_txrefs" | "hasMore" | "tx_url">;

export type BCYBlock = {
    hash: string;
    height: number;
    chain: string;
    total: number;
    fees: number;
    size: number;
    vsize: number;
    ver: number;
    time: string;
    received_time: string;
    relayed_by: string;
    bits: number;
    nonce: number;
    n_tx: number;
    prev_block: string;
    mrkl_root: string;
    txids: string[];
    depth: number;
    prev_block_url: string;
    tx_url: string;
}
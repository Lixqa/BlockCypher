export type TransactionConfidence = {
    age_millis: number;
    receive_count: number;
    confidence: number;
    preference: string;
    txhash: string;
    txurl: string;
}
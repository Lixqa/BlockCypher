import {
  BTCAddress,
  BTCAddressBalance,
  BTCBlock,
  BTCBlockChainInfo,
  BTCTransaction,
} from './api-response-types/btc';
import {
  ETHAddress,
  ETHAddressBalance,
  ETHBlock,
  ETHBlockChainInfo,
  ETHTransaction,
} from './api-response-types/eth';
import {
  LTCAddress,
  LTCAddressBalance,
  LTCBlock,
  LTCBlockChainInfo,
  LTCTransaction,
} from './api-response-types/ltc';
import {
  DOGEAddress,
  DOGEAddressBalance,
  DOGEBlock,
  DOGEBlockChainInfo,
  DOGETransaction,
} from './api-response-types/doge';
import {
  DASHAddress,
  DASHAddressBalance,
  DASHBlock,
  DASHBlockChainInfo,
  DASHTransaction,
} from './api-response-types/dash';
import {
  BCYAddress,
  BCYAddressBalance,
  BCYBlock,
  BCYBlockChainInfo,
  BCYTransaction,
} from './api-response-types/bcy';

export type TransactionMap = {
  btc: BTCTransaction;
  eth: ETHTransaction;
  ltc: LTCTransaction;
  doge: DOGETransaction;
  dash: DASHTransaction;
  bcy: BCYTransaction;
};

export type AddressBalanceMap = {
  btc: BTCAddressBalance;
  eth: ETHAddressBalance;
  ltc: LTCAddressBalance;
  doge: DOGEAddressBalance;
  dash: DASHAddressBalance;
  bcy: BCYAddressBalance;
};

export type AddressMap = {
  btc: BTCAddress;
  eth: ETHAddress;
  ltc: LTCAddress;
  doge: DOGEAddress;
  dash: DASHAddress;
  bcy: BCYAddress;
};

export type BlockChainInfoMap = {
  btc: BTCBlockChainInfo;
  eth: ETHBlockChainInfo;
  ltc: LTCBlockChainInfo;
  doge: DOGEBlockChainInfo;
  dash: DASHBlockChainInfo;
  bcy: BCYBlockChainInfo;
};

export type BlockMap = {
  btc: BTCBlock;
  eth: ETHBlock;
  ltc: LTCBlock;
  doge: DOGEBlock;
  dash: DASHBlock;
  bcy: BCYBlock;
};

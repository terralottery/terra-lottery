/**
 * Result of `Extension.info()` of `terra.js`
 */
import type { HumanAddr } from '@anchor-protocol/types/contracts';

export interface StationNetworkInfo {
  name: string;
  chainID: string;
  lcd: string;
  fcd: string;
  /** WebSocket Address */
  ws: string;
}

export enum WalletStatusType {
  /**
   * wallet provider in initialize
   */
  INITIALIZING = 'initializing',

  /**
   * user can't use transaction
   */
  UNAVAILABLE = 'unavailable',

  /**
   * chrome extension is not installed
   */
  NOT_INSTALLED = 'not_installed',

  /**
   * chrome extension is not connected
   */
  NOT_CONNECTED = 'not_connected',

  /**
   * user can try transaction
   */
  CONNECTED = 'connected',

  /**
   * the wallet address manual provided
   * but, user can't try transaction (the wallet only using for querying)
   */
  WALLET_ADDRESS_CONNECTED = 'wallet_address_connected',
}

export type WalletNotReady = {
  status:
    | WalletStatusType.INITIALIZING
    | WalletStatusType.UNAVAILABLE
    | WalletStatusType.NOT_INSTALLED
    | WalletStatusType.NOT_CONNECTED;
  network: StationNetworkInfo;
};

export type WalletReady = {
  status:
    | WalletStatusType.CONNECTED
    | WalletStatusType.WALLET_ADDRESS_CONNECTED;
  network: StationNetworkInfo;
  walletAddress: HumanAddr;
};

export type WalletStatus = WalletNotReady | WalletReady;

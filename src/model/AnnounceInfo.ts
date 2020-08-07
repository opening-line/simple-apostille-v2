import { SignedTransaction } from "symbol-sdk";

export interface AnnounceInfo {
  signedTransaction: SignedTransaction,
  shouldUseHashLockTransaction: boolean,
}

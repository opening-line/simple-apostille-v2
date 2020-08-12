import { Account } from 'symbol-sdk';
import { HashingType } from './HashingType';

export type DataView = string | ArrayBuffer | Uint8Array
export abstract class HashFunction {
  constructor(public readonly typeHex: HashingType.Type) { }

  public abstract hashing(data: DataView);

  public checkSum = `fe4e5459${this.typeHex}`;

  public signedHashing(data: DataView, account: Account) {
    const hashedData = this.hashing(data);
    return account.signData(hashedData);
  }

  public signedHashingFromHashedData(hashedData: string, account: Account) {
    return account.signData(hashedData);
  }

  public createApostilleTransactionMessage(data: DataView, account: Account) {
    const signedHash = this.signedHashing(data, account);
    return `${this.checkSum}${signedHash}`;
  }

  public createApostilleTransactionMessageFromHashedData(hashedData: string, account: Account) {
    const signedHash = this.signedHashingFromHashedData(hashedData, account);
    return `${this.checkSum}${signedHash}`;
  }
}

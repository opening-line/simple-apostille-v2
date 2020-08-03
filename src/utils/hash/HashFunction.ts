import { Account } from 'symbol-sdk';
import { HashingType } from './HashingType';

export abstract class HashFunction {
  constructor(public readonly typeHex: HashingType.Type) { }

  public abstract hashing(data: string);

  public checkSum = `fe4e5459${this.typeHex}`;

  public signedHashing(data: string, account: Account) {
    const hashedData = this.hashing(data);
    return account.signData(hashedData);
  }

  public signedHashingFromHashedData(hashedData: string, account: Account) {
    return account.signData(hashedData);
  }

  public createApostilleTransactionMessage(data: string, account: Account) {
    const signedHash = this.signedHashing(data, account);
    return `${this.checkSum}${signedHash}`;
  }

  public createApostilleTransactionMessageFromHashedData(hashedData: string, account: Account) {
    const signedHash = this.signedHashingFromHashedData(hashedData, account);
    return `${this.checkSum}${signedHash}`;
  }
}

import { PublicAccount, Account } from 'symbol-sdk';
import { createHash } from 'crypto';

const fixPrivateKey = (privateKey) => {
  return (`0000000000000000000000000000000000000000000000000000000000000000${privateKey.replace(/^00/, '')}`)
    .slice(-64);
};

export class ApostilleAccount {
  /**
   * Apostille account
   */
  public readonly account?: Account;

  /**
   * Apostille public account
   */
  public readonly publicAccount: PublicAccount;

  private constructor(account: Account | PublicAccount) {
    if (account instanceof Account) {
      this.account = account;
      this.publicAccount = account.publicAccount;
    } else {
      this.publicAccount = account;
    }
  }

  /**
   * Create apostille account from seed and owner's account
   * @param seed seed (ex: filename)
   * @param ownerAccount owner's symbol account
   */
  public static create(seed: string, ownerAccount: Account) {
    const {networkType} = ownerAccount.address;
    const hashFunc = createHash('sha256');
    hashFunc.update(seed);
    const hashedSeed = hashFunc.digest('hex');
    const signedSeed = ownerAccount.signData(hashedSeed);
    const privateKey = fixPrivateKey(signedSeed);
    const apostilleAccount = Account.createFromPrivateKey(privateKey, networkType);
    return new ApostilleAccount(apostilleAccount);
  }

  /**
   * Create apostille account from exist account
   * @param existAccount exist apostille account or public account
   */
  public static createFromExistAccount(existAccount: Account | PublicAccount) {
    return new ApostilleAccount(existAccount);
  }
}

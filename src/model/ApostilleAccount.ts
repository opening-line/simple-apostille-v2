import { PublicAccount, Account, MultisigHttp, MultisigAccountInfo } from 'symbol-sdk';
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

  /**
   * Apostille Account's multisig account info
   */
  public multisigInfo?: MultisigAccountInfo;

  /**
   * Symbol API Endpoint
   */
  public apiEndpoint?: string;

  private constructor(account: Account | PublicAccount, apiEndpoint?: string) {
    if (account instanceof Account) {
      this.account = account;
      this.publicAccount = account.publicAccount;
    } else {
      this.publicAccount = account;
    }

    if (apiEndpoint) {
      this.apiEndpoint = apiEndpoint;
    }
  }

  public async getMultisigAccountInfo() {
    if (this.apiEndpoint) {
      try {
        const multisigHttp = new MultisigHttp(this.apiEndpoint);
        const multisigInfo = await multisigHttp.getMultisigAccountInfo(this.publicAccount.address).toPromise();
        this.multisigInfo = multisigInfo;
      } catch(err) {
        if (err.message) {
          const errMessage = JSON.parse(err.message);
          if (errMessage.statusCode !== 404) {
            throw Error('Multisig info error');
          }
        } else {
          throw Error('Multisig info api connection error');
        }
      }
    } else {
      throw Error('API Endpoint is not undefined');
    }
  }

  /**
   * Create apostille account from seed and owner's account
   * @param seed seed (ex: filename)
   * @param ownerAccount owner's symbol account
   */
  public static create(seed: string, ownerAccount: Account, apiEndpoint?: string) {
    const {networkType} = ownerAccount.address;
    const hashFunc = createHash('sha256');
    hashFunc.update(seed);
    const hashedSeed = hashFunc.digest('hex');
    const signedSeed = ownerAccount.signData(hashedSeed);
    const privateKey = fixPrivateKey(signedSeed);
    const apostilleAccount = Account.createFromPrivateKey(privateKey, networkType);
    return new ApostilleAccount(apostilleAccount, apiEndpoint);
  }

  /**
   * Create apostille account from exist account
   * @param existAccount exist apostille account or public account
   */
  public static createFromExistAccount(existAccount: Account | PublicAccount, apiEndpoint?: string) {
    return new ApostilleAccount(existAccount, apiEndpoint);
  }
}

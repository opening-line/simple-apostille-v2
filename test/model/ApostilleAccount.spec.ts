import { Account, NetworkType, PublicAccount } from 'symbol-sdk';
import { ApostilleAccount } from '../../src/model';

describe('should work ApostilleAccount class', () => {
  it('should create apostille account from exits account', () => {
    const existAccount = Account.createFromPrivateKey('D49E2F612535C3AC3528A2BAFC23D129FBCC42070F480E7AAF5FE59EBD22431E', NetworkType.TEST_NET);
    const apostilleAccount = ApostilleAccount.createFromExistAccount(existAccount);
    expect(apostilleAccount.account).toBeDefined();
    expect(apostilleAccount.account!.privateKey).toEqual(existAccount.privateKey);
  });

  it('should create apostille account from exist public account', () => {
    const existPublicAccount = PublicAccount.createFromPublicKey('57F51D909BCD03C0DE6FA075402F43D7D1081387627EFA79B531DCC8E5DD0A2F', NetworkType.TEST_NET);
    const apostilleAccount = ApostilleAccount.createFromExistAccount(existPublicAccount);
    expect(apostilleAccount.account).toBeUndefined();
    expect(apostilleAccount.publicAccount.publicKey).toEqual(existPublicAccount.publicKey);
  });

  it('should create apostille account from seed and owner account', () => {
    const seed = '0123456789abcdef';
    const ownerAccount = Account.createFromPrivateKey('D49E2F612535C3AC3528A2BAFC23D129FBCC42070F480E7AAF5FE59EBD22431E', NetworkType.TEST_NET);
    const apostilleAccount = ApostilleAccount.create(seed, ownerAccount);
    expect(apostilleAccount.publicAccount.address.plain()).toEqual('TA3ADQKLIFWC2V26WYQSPVWD76JCJMCAJZR64BI');
  });
});

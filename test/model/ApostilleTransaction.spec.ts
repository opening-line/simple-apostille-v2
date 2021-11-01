import { Account, NetworkType, Address } from "symbol-sdk";
import { ApostilleTransaction, IApostilleOptions, IApostilleMetadata } from "../../src/model";
import { HashingType } from "../../src/utils/hash";
import { MetadataKeyHelper } from "../../src/utils";

const networkType = NetworkType.TEST_NET;
const data = 'I am legen wait for it dary';
const hashedData = '336eda1a928c499c7cce89373580ed0ba5ab374af90553f0a25e5e32964bb072';
const seed = '0123456789abcdef';
const signerAccount = Account.createFromPrivateKey('F1E7660DB9EF5E73203881304F31B7CCDF167A08055013A633D098EBD94FD36F', networkType);
const owner2 = Address.createFromRawAddress('TAXM7E-K6UF7I-YPSIAH-7BB6KX-SKE2Q5-KGZUQY-ERQ');
const owner3 = Address.createFromRawAddress('TATJFR-D5ENAN-2QD7J4-WKATCB-4T2ZRA-6POK42-SCI')
const message = 'fe4e5459831CF9E29E3BFDE4CBA65C21EDEA5319A8E7CBE49F332AAF563D8C908EA1CC273DE337962081B0301F789CAFF9B6003C5BD94DF5F20B63FDF1399640514FA2CC00';
const feeMultiplier = 100;
const epochAdjustment = 1573430400;

const apiEndpoint = 'https://sym-test963.opening-line.jp:3001';
const generationHashSeed = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';

describe('Should create apostille transaction', () => {
  it('Should create apostille transaction from data', () => {
    const transaction = ApostilleTransaction.createFromData(
      data,
      HashingType.Type.sha256,
      seed,
      signerAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
    );

    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeUndefined();
    expect(transaction.metaDataTransactions).toBeUndefined();
    expect(transaction.coreTransaction!.recipientAddress).toEqual(transaction.apostilleAccount.publicAccount.address);
    expect(transaction.coreTransaction!.message.payload).toEqual(message);
  });

  it('Should create apostille transaction from hashed data', () => {
    const transaction = ApostilleTransaction.createFromHashedData(
      hashedData,
      HashingType.Type.sha256,
      seed,
      signerAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
    );
    
    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeUndefined();
    expect(transaction.metaDataTransactions).toBeUndefined();
    expect(transaction.coreTransaction!.recipientAddress).toEqual(transaction.apostilleAccount.publicAccount.address);
    expect(transaction.coreTransaction!.message.payload).toEqual(message);
  });

  it('Should create apostille transaction with assign ownership', () => {
    const options: IApostilleOptions = {
      assignOwners: [
        signerAccount.address,
      ]
    };
    const transaction = ApostilleTransaction.createFromHashedData(
      hashedData,
      HashingType.Type.sha256,
      seed,
      signerAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
      options
    );

    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeDefined();
    expect(transaction.metaDataTransactions).toBeUndefined();
    expect(transaction.assignOwnerShipTransaction!.minApprovalDelta).toEqual(options.assignOwners!.length);
    expect(transaction.assignOwnerShipTransaction!.minRemovalDelta).toEqual(
      options.assignOwners!.length
    );
    expect(transaction.assignOwnerShipTransaction!.addressAdditions).toContain(signerAccount.address);
  });

  it('Should create apostille transaction with assign multiple owner', () => {
    const options: IApostilleOptions = {
      assignOwners: [
        signerAccount.address,
        owner2,
        owner3,
      ],
    };
    const transaction = ApostilleTransaction.createFromHashedData(
      hashedData,
      HashingType.Type.sha256,
      seed,
      signerAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
      options
    );

    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeDefined();
    expect(transaction.metaDataTransactions).toBeUndefined();
    expect(transaction.assignOwnerShipTransaction!.minApprovalDelta).toEqual(options.assignOwners!.length - 1);
    expect(transaction.assignOwnerShipTransaction!.minRemovalDelta).toEqual(options.assignOwners!.length - 1);
    expect(transaction.assignOwnerShipTransaction!.addressAdditions).toContain(signerAccount.address);
    expect(transaction.assignOwnerShipTransaction!.addressAdditions).toContain(owner2);
    expect(transaction.assignOwnerShipTransaction!.addressAdditions).toContain(owner3);
  });

  it('Should create apostille transaction with metadata', () => {
    const authorName = 'Saburo Yamada';
    const metadata: IApostilleMetadata = {
      author: authorName,
    };
    const options: IApostilleOptions = {
      metadata,
    };
    const transaction = ApostilleTransaction.createFromHashedData(
      hashedData,
      HashingType.Type.sha256,
      seed,
      signerAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
      options
    );

    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeUndefined();
    expect(transaction.metaDataTransactions).toBeDefined();
    expect(transaction.metaDataTransactions!.length).toEqual(Object.keys(metadata).length);
    transaction.metaDataTransactions!.forEach((x) => {
      const targetAddress= x.targetAddress as Address;
      expect(targetAddress.plain()).toEqual(transaction.apostilleAccount.publicAccount.address.plain());
      expect(x.scopedMetadataKey).toEqual(MetadataKeyHelper.keyToKeyId('author'));
      expect(x.value).toEqual(authorName);
    });
  });
  it('Should create apostille transaction with metadata fullwidth characters', () => {
    const authorName = '三郎 山田';
    const metadata: IApostilleMetadata = {
      author: authorName,
    };
    const options: IApostilleOptions = {
      metadata,
    };
    const transaction = ApostilleTransaction.createFromHashedData(
      hashedData,
      HashingType.Type.sha256,
      seed,
      signerAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
      options
    );

    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeUndefined();
    expect(transaction.metaDataTransactions).toBeDefined();
    expect(transaction.metaDataTransactions!.length).toEqual(Object.keys(metadata).length);
    transaction.metaDataTransactions!.forEach((x) => {
      const targetAddress= x.targetAddress as Address;
      expect(targetAddress.plain()).toEqual(transaction.apostilleAccount.publicAccount.address.plain());
      expect(x.scopedMetadataKey).toEqual(MetadataKeyHelper.keyToKeyId('author'));
      expect(x.value).toEqual(authorName);
    });
  });
});

describe('Should create update transaction', () => {
  const apostilleAccount = Account.createFromPrivateKey('1CA13EBB09707269E9EFDBE409C6295061EFA4EFAE5D356952FA1E27568E9E07', networkType);
  it('Should create update transaction from data', () => {
    const transaction = ApostilleTransaction.updateFromData(
      data,
      HashingType.Type.sha256,
      signerAccount,
      apostilleAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
    );
    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeUndefined();
    expect(transaction.metaDataTransactions).toBeUndefined();
    expect(transaction.coreTransaction!.recipientAddress).toEqual(apostilleAccount.publicAccount.address);
    expect(transaction.coreTransaction!.message.payload).toEqual(message);
  });

  it('Should create update transaction from hashed data', () => {
    const transaction = ApostilleTransaction.updateFromHashedData(
      hashedData,
      HashingType.Type.sha256,
      signerAccount,
      apostilleAccount,
      networkType,
      generationHashSeed,
      feeMultiplier,
      apiEndpoint,
      epochAdjustment,
    );
    expect(transaction.coreTransaction).toBeDefined();
    expect(transaction.assignOwnerShipTransaction).toBeUndefined();
    expect(transaction.metaDataTransactions).toBeUndefined();
    expect(transaction.coreTransaction!.recipientAddress).toEqual(apostilleAccount.publicAccount.address);
    expect(transaction.coreTransaction!.message.payload).toEqual(message);
  })
});

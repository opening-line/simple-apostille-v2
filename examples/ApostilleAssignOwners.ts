/* eslint-disable no-console */
import { NetworkType, Account, RepositoryFactoryHttp, Address, HashLockTransaction, Deadline, UInt64, TransactionService, Currency } from 'symbol-sdk';
import { IApostilleOptions, ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data = 'Hello World!';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const signerKey = '3E04C96EBAE99124A1D388B05EBD007AA06CB917E09CA08F5859B3ADC49A148D';
const networkType = NetworkType.TEST_NET;
const account = Account.createFromPrivateKey(signerKey, networkType);

const owner1 = Address.createFromRawAddress('TAMBYNUGGDWZBFUZBJX4HWQCNJ2IBB5XVJVCMJQ');
const owner2 = Address.createFromRawAddress('TBCCZ3HXPZLPQBEY6LZ2A3NE6WL5DHKZOMWMZFA');

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';
const generationHash = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD';
const feeMultiplier = 1000;
const epochAdjustment = 1573430400;

const repositoryFactory = new RepositoryFactoryHttp(
  apiEndpoint,
  { generationHash, networkType }
);

const assignOwners = [
  account.address,
  owner1,
  owner2,
];

const option: IApostilleOptions = {
  assignOwners
};

const apostilleTransaction = ApostilleTransaction.createFromData(
  data,
  HashingType.Type.sha256,
  seed,
  account,
  networkType,
  generationHash,
  feeMultiplier,
  apiEndpoint,
  epochAdjustment,
  option
);

apostilleTransaction.singedTransactionAndAnnounceType().then((info) => {
  const signedTx = info.signedTransaction;
  console.log(signedTx.hash);
  const hashLockTx = HashLockTransaction.create(
    Deadline.create(epochAdjustment),
    Currency.PUBLIC.createRelative(10),
    UInt64.fromUint(480),
    signedTx,
    networkType,
  ).setMaxFee(feeMultiplier);

  const signedHashLockTx = account.sign(hashLockTx, generationHash);
  console.log(signedHashLockTx.hash);

  const transactionService = new TransactionService(
    repositoryFactory.createTransactionRepository(),
    repositoryFactory.createReceiptRepository(),
  );
  const listener = repositoryFactory.createListener();
  listener.open().then(() => {
    transactionService.announceHashLockAggregateBonded(
      signedHashLockTx,
      signedTx,
      listener
    ).subscribe((x) => {
      listener.close();
      console.log(x);
    }, (err) => {
      listener.close();
      console.error(err);
    })
  }).catch((err) => {
    console.error(err);
    listener.close();
  })
}).catch((err) => {
  console.error(err);
})

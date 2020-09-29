/* eslint-disable no-console */
import { Account, NetworkType, RepositoryFactoryHttp, TransactionService } from 'symbol-sdk';
import { ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data = 'Hello World!';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const ownerKey = '3E04C96EBAE99124A1D388B05EBD007AA06CB917E09CA08F5859B3ADC49A148D';
const networkType = NetworkType.TEST_NET;
const account = Account.createFromPrivateKey(ownerKey, networkType);

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';
const generationHash = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD';
const feeMultiplier = 100;
const repositoryFactory = new RepositoryFactoryHttp(
  apiEndpoint,
  { generationHash, networkType }
);

const apostilleTransaction = ApostilleTransaction.createFromData(
  data,
  HashingType.Type.sha256,
  seed,
  account,
  networkType,
  generationHash,
  feeMultiplier,
  apiEndpoint
);

apostilleTransaction.singedTransactionAndAnnounceType().then((info) => {
  const signedTx = info.signedTransaction;
  console.log(signedTx.hash);
  const transactionService = new TransactionService(
    repositoryFactory.createTransactionRepository(),
    repositoryFactory.createReceiptRepository(),
  );
  const listener = repositoryFactory.createListener();
  listener.open().then(() => {
    transactionService.announce(signedTx, listener).subscribe(
      (x) => {
        console.log('--- Apostille created ---');
        console.log(`txHash: ${x.transactionInfo!.hash}`);
        console.log(`apostille owner key: ${apostilleTransaction.apostilleAccount.account!.privateKey}`);
        listener.close();
      }, (err) => {
        console.error(err);
        listener.close();
      }
    )
  }).catch((err) => {
    console.error(err);
    listener.close();
  })
}).catch((err) => {
  console.error(err);
});

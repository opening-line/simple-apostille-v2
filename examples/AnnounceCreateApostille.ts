/* eslint-disable no-console */
import { Account, NetworkType, RepositoryFactoryHttp, TransactionService } from 'symbol-sdk';
import { ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data = 'Hello World!';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const ownerKey = '3FDF8213014388A174A4B5F8DF4C7A502C8D8C1D8872188D6E17A25A53FA438A';
const networkType = NetworkType.TEST_NET;
const account = Account.createFromPrivateKey(ownerKey, networkType);

const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';
const generationHash = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';
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

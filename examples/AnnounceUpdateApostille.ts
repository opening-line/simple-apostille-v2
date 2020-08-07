/* eslint-disable no-console */
import { Account, NetworkType, RepositoryFactoryHttp, TransactionService } from "symbol-sdk";
import { ApostilleTransaction } from "../src/model";
import { HashingType } from "../src/utils/hash";

const networkType = NetworkType.TEST_NET;

const data = 'Hello World!!';

const apostilleAccountKey = '3E2E5B3E437066FE9EAEC3B421AD5AC96C657ED1560DC408D49B87A32248CD0F';
const apostilleAccount = Account.createFromPrivateKey(apostilleAccountKey, networkType);

const ownerKey = '59087E5F5B04C1F23DB7C791895EBC1DD8AAA0BB56F47213BD18E333C64BB3C8';
const ownerAccount = Account.createFromPrivateKey(ownerKey, networkType);

const apiEndpoint = 'https://sym-test963.opening-line.jp:3001';
const generationHash = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';
const repositoryFactory = new RepositoryFactoryHttp(
  apiEndpoint,
  { generationHash, networkType }
);
const feeMultiplier = 100;

const apostilleTx = ApostilleTransaction.updateFromData(
  data,
  HashingType.Type.sha256,
  ownerAccount,
  apostilleAccount,
  networkType,
  generationHash,
  feeMultiplier,
  apiEndpoint
);

apostilleTx.singedTransactionAndAnnounceType().then((info) => {
  const signedTx = info.signedTransaction;
  const transactionService = new TransactionService(
    repositoryFactory.createTransactionRepository(),
    repositoryFactory.createReceiptRepository(),
  );
  const listener = repositoryFactory.createListener();
  listener.open().then(() => {
    transactionService.announce(signedTx, listener).subscribe((x) => {
      console.log('--- Apostille updated ---');
      console.log(`txHash: ${x.transactionInfo!.hash}`);
      listener.close();
    }, (err) => {
      console.error(err);
      listener.close();
    })
  }).catch((err) => {
    console.error(err);
    listener.close();
  })
}).catch((err) => {
  console.error(err);
});

/* eslint-disable no-console */
import { Account, NetworkType, RepositoryFactoryHttp, TransactionService } from "symbol-sdk";
import { ApostilleTransaction } from "../src/model";
import { HashingType } from "../src/utils/hash";

const networkType = NetworkType.TEST_NET;

const data = 'Hello World!!';

const apostilleAccountKey = 'CC02E6CF86EBEA0F83DBFD45413F7529A5459514148718BD0EFCA6263E6CF10A';
const apostilleAccount = Account.createFromPrivateKey(apostilleAccountKey, networkType);

const ownerKey = '3FDF8213014388A174A4B5F8DF4C7A502C8D8C1D8872188D6E17A25A53FA438A';
const ownerAccount = Account.createFromPrivateKey(ownerKey, networkType);

const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';
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

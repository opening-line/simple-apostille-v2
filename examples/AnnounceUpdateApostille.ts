/* eslint-disable no-console */
import { Account, NetworkType, RepositoryFactoryHttp, AggregateTransaction, Deadline, TransactionService } from "symbol-sdk";
import { ApostilleTransaction } from "../src/model";
import { HashingType } from "../src/utils/hash";

const networkType = NetworkType.TEST_NET;

const data = 'Hello World!!';

const apostilleAccountKey = '67291173772EAE8F83CC5D6F957A7074BCC4D4A6421A0C44CAFC35EBB72D7205';
const apostilleAccount = Account.createFromPrivateKey(apostilleAccountKey, networkType);

const ownerKey = '59087E5F5B04C1F23DB7C791895EBC1DD8AAA0BB56F47213BD18E333C64BB3C8';
const ownerAccount = Account.createFromPrivateKey(ownerKey, networkType);

const apiEndpoint = 'https://sym-test963.opening-line.jp:3001';
const generationHash = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';
const repositoryFactory = new RepositoryFactoryHttp(
  apiEndpoint,
  { generationHash, networkType }
);

const apostilleTx = ApostilleTransaction.updateFromData(
  data,
  HashingType.Type.sha256,
  ownerAccount,
  apostilleAccount,
  networkType,
  apiEndpoint
);

const aggregateTx = AggregateTransaction.createComplete(
  Deadline.create(),
  apostilleTx.innerTransactions!,
  networkType,
  []
).setMaxFeeForAggregate(100, 1);

const signedTx = ownerAccount.sign(
  aggregateTx,
  generationHash,
);

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
  });
});

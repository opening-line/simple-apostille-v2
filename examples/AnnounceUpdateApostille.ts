/* eslint-disable no-console */
import { Account, NetworkType, RepositoryFactoryHttp, TransactionService } from "symbol-sdk";
import { ApostilleTransaction } from "../src/model";
import { HashingType } from "../src/utils/hash";

const networkType = NetworkType.TEST_NET;

const data = 'Hello World!!';

const apostilleAccountKey = 'D9CCB105BDD459432EC7E0A36195F764B210A4ED3BBEEB32BA87D9435C239C09';
const apostilleAccount = Account.createFromPrivateKey(apostilleAccountKey, networkType);

const ownerKey = '3E04C96EBAE99124A1D388B05EBD007AA06CB917E09CA08F5859B3ADC49A148D';
const ownerAccount = Account.createFromPrivateKey(ownerKey, networkType);

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';
const generationHash = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD';
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

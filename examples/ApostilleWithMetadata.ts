/* eslint-disable no-console */
import { Account, RepositoryFactoryHttp, TransactionService } from 'symbol-sdk';
import { IApostilleMetadata, IApostilleOptions, ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data  = 'Hello World';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const singerKey = '__INPUT_YOUR_PRIVATE_KEY__';

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

let networkType = 0;
let generationHash = '';
let feeMultiplier = 0;
let epochAdjustment = 0;

const repoFactory = new RepositoryFactoryHttp(apiEndpoint);

async function getNetworkProps() {
  generationHash = await repoFactory.getGenerationHash().toPromise();
  networkType = await repoFactory.getNetworkType().toPromise();
  epochAdjustment = await repoFactory.getEpochAdjustment().toPromise();
}

async function getFeeMultiplier() {
  const networkRepo = await repoFactory.createNetworkRepository();
  const feeMultipliers = await networkRepo.getTransactionFees().toPromise();
  feeMultiplier = feeMultipliers.minFeeMultiplier;
}

const metadata: IApostilleMetadata = {
  filename: seed,
  description: 'ApostilleSample',
  author: 'daoka',
};

const option: IApostilleOptions = {
  metadata,
}

async function announceApostilleTx() {
  const singer = Account.createFromPrivateKey(singerKey, networkType);
  const apostilleTransaction = ApostilleTransaction.createFromData(
    data,
    HashingType.Type.sha256,
    seed,
    singer,
    networkType,
    generationHash,
    feeMultiplier,
    apiEndpoint,
    epochAdjustment,
    option
  );

  apostilleTransaction.singedTransactionAndAnnounceType().then((info) => {
    const signedTx = info.signedTransaction;
    const transactionService = new TransactionService(
      repoFactory.createTransactionRepository(),
      repoFactory.createReceiptRepository(),
    );
    const listener = repoFactory.createListener();
    listener.open().then(() => {
      transactionService.announce(signedTx, listener).subscribe((x) => {
        console.log('--- Apostille created ---');
        console.log(`txHash: ${x.transactionInfo!.hash}`);
        console.log(`apostille owner key: ${apostilleTransaction.apostilleAccount.account!.privateKey}`);
        listener.close();
      }, (err) => {
        console.error(err);
        listener.close();
      });
    }).catch((err) => {
      console.error(err);
    })
  })
}

async function main() {
  await getNetworkProps();
  await getFeeMultiplier();
  await announceApostilleTx();
}

main().then(() => {});

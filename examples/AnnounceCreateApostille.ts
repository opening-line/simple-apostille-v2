/* eslint-disable no-console */
import { Account, RepositoryFactoryHttp, TransactionService } from 'symbol-sdk';
import { ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data = 'Hello World!';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const signerKey = '__INPUT_YOUR_PRIVATE_KEY__';

const apiEndpoint = 'https://sym-test.opening-line.jp:3001';
let networkType = 0;
let generationHash = ''
let epochAdjustment = 0;
let feeMultiplier = 0;

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

async function announceApostilleTx() {
  const account = Account.createFromPrivateKey(signerKey, networkType);
  const apostilleTx = ApostilleTransaction.createFromData(
    data,
    HashingType.Type.sha256,
    seed,
    account,
    networkType,
    generationHash,
    feeMultiplier,
    apiEndpoint,
    epochAdjustment
  );
  const announceInfo = await apostilleTx.singedTransactionAndAnnounceType();
  const transactionRepo = repoFactory.createTransactionRepository();
  const receiptRepo = repoFactory.createReceiptRepository();
  const transactionService = new TransactionService(transactionRepo, receiptRepo);
  const listener = repoFactory.createListener();

  listener.open().then(() => {
    transactionService.announce(announceInfo.signedTransaction, listener).subscribe((x) => {
      console.log(`txHash: ${x.transactionInfo?.hash}`);
      console.log(`apostille owner key: ${apostilleTx.apostilleAccount.account?.privateKey}`);
      listener.close();
    }, (err) => {
      console.error(err);
      listener.close();
    });
  });
}

async function main() {
  await getNetworkProps();
  await getFeeMultiplier();
  await announceApostilleTx();
}

main().then(() => {});

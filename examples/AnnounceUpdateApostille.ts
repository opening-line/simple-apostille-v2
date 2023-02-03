/* eslint-disable no-console */
import { lastValueFrom } from "rxjs";
import { Account, RepositoryFactoryHttp, TransactionService } from "symbol-sdk";
import { ApostilleTransaction } from "../src/model";
import { HashingType } from "../src/utils/hash";

const data = 'Hello World!!';
const signerKey = '__INPUT_YOUR_PRIVATE_KEY__';
const apostilleAccountKey = '__INPUT_YOUR_APOSTILLE_ACCOUNT_PRIVATE_KEY__';
const apiEndpoint = 'https://sym-test.opening-line.jp:3001';

let networkType = 0;
let generationHash = ''
let epochAdjustment = 0;
let feeMultiplier = 0;

const repoFactory = new RepositoryFactoryHttp(apiEndpoint);

async function getNetworkProps() {
  generationHash = await lastValueFrom(repoFactory.getGenerationHash());
  networkType = await lastValueFrom(repoFactory.getNetworkType());
  epochAdjustment = await lastValueFrom(repoFactory.getEpochAdjustment());
}

async function getFeeMultiplier() {
  const networkRepo = await repoFactory.createNetworkRepository();
  const feeMultipliers = await lastValueFrom(networkRepo.getTransactionFees());
  feeMultiplier = feeMultipliers.minFeeMultiplier;
}

async function announceUpdateApostilleTx() {
  const signer = Account.createFromPrivateKey(signerKey, networkType);
  const apostilleAccount = Account.createFromPrivateKey(apostilleAccountKey, networkType);

  const apostilleTx = ApostilleTransaction.updateFromData(
    data,
    HashingType.Type.sha256,
    signer,
    apostilleAccount,
    networkType,
    generationHash,
    feeMultiplier,
    apiEndpoint,
    epochAdjustment
  );

  const announceInfo = await apostilleTx.signedTransactionAndAnnounceType();
  const transactionRepo = repoFactory.createTransactionRepository();
  const receiptRepo = repoFactory.createReceiptRepository();
  const transactionService = new TransactionService(
    transactionRepo,
    receiptRepo,
  );
  const listener = repoFactory.createListener();

  listener.open().then(() => {
    transactionService.announce(announceInfo.signedTransaction, listener).subscribe({
      next(x) {
        console.log(`txHash: ${x.transactionInfo?.hash}`);
        listener.close();
      },
      error(err) {
        console.error(err);
        listener.close();
      }
    })
  })
}

async function main() {
  await getNetworkProps();
  await getFeeMultiplier();
  await announceUpdateApostilleTx();
}

main().then(() => {});

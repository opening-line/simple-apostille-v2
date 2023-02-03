/* eslint-disable no-console */
import { lastValueFrom } from 'rxjs';
import { Account, RepositoryFactoryHttp, TransactionService } from 'symbol-sdk';
import { IApostilleMetadata, IApostilleOptions, ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data  = 'Hello World';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const signerKey = '__INPUT_YOUR_PRIVATE_KEY__';

const apiEndpoint = 'http://sym-test-01.opening-line.jp:3000';

let networkType = 0;
let generationHash = '';
let feeMultiplier = 0;
let epochAdjustment = 0;

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

const metadata: IApostilleMetadata = {
  filename: seed,
  description: 'ApostilleSample',
  author: 'daoka',
};

const option: IApostilleOptions = {
  metadata,
}

async function announceApostilleTx() {
  const signer = Account.createFromPrivateKey(signerKey, networkType);
  const apostilleTransaction = ApostilleTransaction.createFromData(
    data,
    HashingType.Type.sha256,
    seed,
    signer,
    networkType,
    generationHash,
    feeMultiplier,
    apiEndpoint,
    epochAdjustment,
    option
  );

  apostilleTransaction.signedTransactionAndAnnounceType().then((info) => {
    const signedTx = info.signedTransaction;
    const transactionService = new TransactionService(
      repoFactory.createTransactionRepository(),
      repoFactory.createReceiptRepository(),
    );
    const listener = repoFactory.createListener();
    listener.open().then(() => {
      transactionService.announce(signedTx, listener).subscribe({
        next(x) {
          console.log('--- Apostille created ---');
          console.log(`txHash: ${x.transactionInfo!.hash}`);
          console.log(`apostille owner key: ${apostilleTransaction.apostilleAccount.account!.privateKey}`);
          listener.close();
        },
        error(err) {
          console.error(err);listener.close();
        }
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

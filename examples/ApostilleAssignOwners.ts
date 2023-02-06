/* eslint-disable no-console */
import { lastValueFrom } from 'rxjs';
import { Account, RepositoryFactoryHttp, Address, HashLockTransaction, Deadline, UInt64, TransactionService, Currency } from 'symbol-sdk';
import { IApostilleOptions, ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data = 'Hello World!';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const signerKey = '__INPUT_YOUR_PRIVATE_KEY__';

const apiEndpoint = 'http://sym-test-01.opening-line.jp:3000';
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

async function announceApostilleTx() {
  const signer = Account.createFromPrivateKey(signerKey, networkType);
  const owner1 = Address.createFromRawAddress('__INPUT_ASSIGN_OWNER_ADDRESS1__');
  const owner2 = Address.createFromRawAddress('__INPUT_ASSIGN_OWNER_ADDRESS2__');

  const assignOwners = [
    signer.address,
    owner1,
    owner2,
  ];

  const option: IApostilleOptions = {
    assignOwners
  };

  const apostilleTx = ApostilleTransaction.createFromData(
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

  apostilleTx.signedTransactionAndAnnounceType().then((info) => {
    const signedTx = info.signedTransaction;
    const hashLockTx = HashLockTransaction.create(
      Deadline.create(epochAdjustment),
      Currency.PUBLIC.createRelative(10),
      UInt64.fromUint(480),
      signedTx,
      networkType,
    ).setMaxFee(feeMultiplier);

    const signedHashLockTx = signer.sign(hashLockTx, generationHash);

    const transactionService = new TransactionService(
      repoFactory.createTransactionRepository(),
      repoFactory.createReceiptRepository(),
    );
    const listener = repoFactory.createListener();
    listener.open().then(() => {
      transactionService.announceHashLockAggregateBonded(
        signedHashLockTx,
        signedTx,
        listener
      ).subscribe({
        next(x) {
          listener.close();
          console.log(x);
        },
        error(err) {
          listener.close();
          console.error(err);
        }
      });
    });
  });
}

async function main() {
  await getNetworkProps();
  await getFeeMultiplier();
  await announceApostilleTx();
}

main().then(() => {});

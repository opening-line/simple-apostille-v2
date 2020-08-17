/* eslint-disable no-console */
import { NetworkType, Account, RepositoryFactoryHttp, Address, HashLockTransaction, Deadline, NetworkCurrencyPublic, UInt64, TransactionService } from 'symbol-sdk';
import { IApostilleOptions, ApostilleTransaction } from '../src/model';
import { HashingType } from '../src/utils/hash';

const data = 'Hello World!';
const seed = `hello_${new Date().toLocaleString()}.txt`;

const signerKey = '3FDF8213014388A174A4B5F8DF4C7A502C8D8C1D8872188D6E17A25A53FA438A';
const networkType = NetworkType.TEST_NET;
const account = Account.createFromPrivateKey(signerKey, networkType);

const owner1 = Address.createFromRawAddress('TA6R2I-AGB6UC-52LIVT-KTRAPQ-WKCYJA-APLJIL-VMQ');
const owner2 = Address.createFromRawAddress('TCGW6Z-J7NMDU-SRQFKK-XPSU4S-5AXCCS-GFMFU3-TMA');

const apiEndpoint = 'https://sym-test964.opening-line.jp:3001';
const generationHash = '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';
const feeMultiplier = 400;
const repositoryFactory = new RepositoryFactoryHttp(
  apiEndpoint,
  { generationHash, networkType }
);

const assignOwners = [
  account.address,
  owner1,
  owner2,
];

const option: IApostilleOptions = {
  assignOwners
};

const apostilleTransaction = ApostilleTransaction.createFromData(
  data,
  HashingType.Type.sha256,
  seed,
  account,
  networkType,
  generationHash,
  feeMultiplier,
  apiEndpoint,
  option
);

apostilleTransaction.singedTransactionAndAnnounceType().then((info) => {
  const signedTx = info.signedTransaction;
  console.log(signedTx.hash);
  const hashLockTx = HashLockTransaction.create(
    Deadline.create(),
    NetworkCurrencyPublic.createRelative(10),
    UInt64.fromUint(480),
    signedTx,
    networkType,
  ).setMaxFee(feeMultiplier);

  const signedHashLockTx = account.sign(hashLockTx, generationHash);
  console.log(signedHashLockTx.hash);

  const transactionService = new TransactionService(
    repositoryFactory.createTransactionRepository(),
    repositoryFactory.createReceiptRepository(),
  );
  const listener = repositoryFactory.createListener();
  listener.open().then(() => {
    transactionService.announceHashLockAggregateBonded(
      signedHashLockTx,
      signedTx,
      listener
    ).subscribe((x) => {
      listener.close();
      console.log(x);
    }, (err) => {
      listener.close();
      console.error(err);
    })
  }).catch((err) => {
    console.error(err);
    listener.close();
  })
}).catch((err) => {
  console.error(err);
})

import { Account, MultisigAccountModificationTransaction, AccountMetadataTransaction, TransferTransaction, Deadline, PlainMessage, NetworkType, InnerTransaction } from "symbol-sdk";
import { HashingType, HashFunctionCreator } from "../utils/hash";
import { MetadataKeyHelper } from "../utils/MetadataKeyHelper";
import { ApostilleAccount } from "./ApostilleAccount";
import { IApostilleOptions } from "./ApostilleOptions";

export class ApostilleTransaction {
  public coreTransaction?: TransferTransaction;

  public assignOwnerShipTransaction?: MultisigAccountModificationTransaction;

  public metaDataTransactions?: AccountMetadataTransaction[];

  public innerTransactions?: InnerTransaction[];

  /**
   * 
   * @param data 
   * @param hashingType 
   * @param seed 
   * @param ownerAccount 
   * @param networkType 
   * @param options Options should not use by update.
   */
  public static createFromData(
    data: string,
    hashingType: HashingType.Type,
    seed: string,
    ownerAccount: Account,
    networkType: NetworkType,
    options?: IApostilleOptions,
    ) {
      const hashFunc = HashFunctionCreator.create(hashingType);
      const apostilleMessage = hashFunc.createApostilleTransactionMessage(data, ownerAccount);
      const apostilleAccount = ApostilleAccount.create(seed, ownerAccount);
      const apostilleTransaction = new ApostilleTransaction(
        ownerAccount,
        apostilleAccount,
        apostilleMessage,
        networkType,
        options,
      );
      return apostilleTransaction;
  }

  /**
   * 
   * @param hashedData 
   * @param hashingType 
   * @param seed 
   * @param ownerAccount 
   * @param networkType 
   * @param options Options should not use by update.
   */
  public static createFromHashedData(
    hashedData: string,
    hashingType: HashingType.Type,
    seed: string,
    ownerAccount: Account,
    networkType: NetworkType,
    options?: IApostilleOptions,
    ) {
      const hashFunc = HashFunctionCreator.create(hashingType);
      const apostilleMessage = hashFunc.createApostilleTransactionMessageFromHashedData(hashedData, ownerAccount);
      const apostilleAccount = ApostilleAccount.create(seed, ownerAccount);
      const apostilleTransaction = new ApostilleTransaction(
        ownerAccount,
        apostilleAccount,
        apostilleMessage,
        networkType,
        options,
      );
      return apostilleTransaction;
  }

  private constructor(
    public readonly ownerAccount: Account,
    public readonly apostilleAccount: ApostilleAccount,
    private readonly apostilleMessage: string,
    private readonly networkType: NetworkType,
    private readonly options?: IApostilleOptions,
  ) {
    this.createCoreTransaction();
    this.createAssignOwnershipTransaction();
    this.createMetadataTransactions();
    this.convertInnerTransactions();
  }

  private createCoreTransaction() {
    const tx = TransferTransaction.create(
      Deadline.create(),
      this.apostilleAccount.publicAccount.address,
      [],
      PlainMessage.create(this.apostilleMessage),
      this.networkType,
    );
    this.coreTransaction = tx;
  }

  private createAssignOwnershipTransaction() {
    if (this.options && this.options.assignOwners) {
      let approvalNum = 0;
      if (this.options.assignOwners.length <= 2) {
        approvalNum = this.options.assignOwners.length;
      } else {
        approvalNum = this.options.assignOwners.length - 1;
      }
      const tx = MultisigAccountModificationTransaction.create(
        Deadline.create(),
        approvalNum,
        approvalNum,
        this.options.assignOwners,
        [],
        this.networkType,
      );
      this.assignOwnerShipTransaction = tx;
    }
  }

  private async createMetadataTransactions() {
    if (this.options && this.options.metadata) {
      const txs: AccountMetadataTransaction[] = [];
      Object.entries(this.options.metadata).forEach(([k, v]) => {
        const tx = AccountMetadataTransaction.create(
          Deadline.create(),
          this.apostilleAccount.publicAccount.address,
          MetadataKeyHelper.keyToKeyId(k),
          v.length,
          v,
          this.networkType,
        )
        txs.push(tx);
      });
      this.metaDataTransactions = txs;
    }
  }

  public convertInnerTransactions() {
    const innerTxs: InnerTransaction[] = []
    if (this.coreTransaction) {
      const innerTx = this.coreTransaction.toAggregate(this.ownerAccount.publicAccount);
      innerTxs.push(innerTx);
    }
    if (this.assignOwnerShipTransaction) {
      const innerTx = this.assignOwnerShipTransaction.toAggregate(this.apostilleAccount.publicAccount);
      innerTxs.push(innerTx);
    }
    if (this.metaDataTransactions) {
      this.metaDataTransactions.forEach((tx) => {
        const innerTx = tx.toAggregate(this.apostilleAccount.publicAccount);
        innerTxs.push(innerTx);
      });
    }
    this.innerTransactions = innerTxs;
  }

  public shouldAnnounceByBondedTransaction() {
    return true;
  }
}

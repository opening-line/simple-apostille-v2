import { Account, MultisigAccountModificationTransaction, AccountMetadataTransaction, TransferTransaction, Deadline, PlainMessage, NetworkType, InnerTransaction, PublicAccount, AggregateTransaction } from "symbol-sdk";
import { HashingType, HashFunctionCreator, DataView } from "../utils/hash";
import { MetadataKeyHelper } from "../utils/MetadataKeyHelper";
import { ApostilleAccount } from "./ApostilleAccount";
import { IApostilleOptions } from "./ApostilleOptions";
import { AnnounceInfo } from "./AnnounceInfo";


export enum AnnounceType {
  CompleteWithApostilleAccountSign,
  CompleteWithoutApostilleAccountSing,
  BondedWithApostilleAccountSing,
  BondedWithoutApostilleAccountSing,
  CannotAnnounce,
  Unknown,
}

export class ApostilleTransaction {
  public coreTransaction?: TransferTransaction;

  public assignOwnerShipTransaction?: MultisigAccountModificationTransaction;

  public metaDataTransactions?: AccountMetadataTransaction[];

  private announceType?: AnnounceType;

  /**
   * 
   * @param data 
   * @param hashingType 
   * @param seed 
   * @param singerAccount 
   * @param networkType 
   * @param generationHashSeed 
   * @param feeMultiplier 
   * @param apiEndpoint 
   * @param options 
   */
  public static createFromData(
    data: DataView,
    hashingType: HashingType.Type,
    seed: string,
    singerAccount: Account,
    networkType: NetworkType,
    generationHashSeed: string,
    feeMultiplier: number,
    apiEndpoint?: string,
    options?: IApostilleOptions,
    ) {
      const hashFunc = HashFunctionCreator.create(hashingType);
      const apostilleMessage = hashFunc.createApostilleTransactionMessage(data, singerAccount);
      const apostilleAccount = ApostilleAccount.create(seed,
        singerAccount,
        apiEndpoint);
      const apostilleTransaction = new ApostilleTransaction(
        singerAccount,
        apostilleAccount,
        apostilleMessage,
        networkType,
        generationHashSeed,
        feeMultiplier,
        options,
      );
      return apostilleTransaction;
  }

  /**
   * 
   * @param hashedData 
   * @param hashingType 
   * @param seed 
   * @param signerAccount 
   * @param networkType 
   * @param generationHashSeed 
   * @param feeMultiplier 
   * @param apiEndpoint 
   * @param options 
   */
  public static createFromHashedData(
    hashedData: string,
    hashingType: HashingType.Type,
    seed: string,
    signerAccount: Account,
    networkType: NetworkType,
    generationHashSeed: string,
    feeMultiplier: number,
    apiEndpoint: string,
    options?: IApostilleOptions,
    ) {
      const hashFunc = HashFunctionCreator.create(hashingType);
      const apostilleMessage = hashFunc.createApostilleTransactionMessageFromHashedData(hashedData, signerAccount);
      const apostilleAccount = ApostilleAccount.create(seed,
        signerAccount,
        apiEndpoint);
      const apostilleTransaction = new ApostilleTransaction(
        signerAccount,
        apostilleAccount,
        apostilleMessage,
        networkType,
        generationHashSeed,
        feeMultiplier,
        options,
      );
      return apostilleTransaction;
  }

  /**
   * 
   * @param data 
   * @param hashingType 
   * @param signerAccount 
   * @param existApostilleAccount 
   * @param networkType 
   * @param generationHashSeed 
   * @param feeMultiplier 
   * @param apiEndpoint 
   */
  public static updateFromData(
    data: DataView,
    hashingType: HashingType.Type,
    signerAccount: Account,
    existApostilleAccount: Account | PublicAccount,
    networkType: NetworkType,
    generationHashSeed: string,
    feeMultiplier: number,
    apiEndpoint: string,
  ) {
    const hashFunc = HashFunctionCreator.create(hashingType);
    const apostilleMessage = hashFunc.createApostilleTransactionMessage(
      data, signerAccount
    );
    const apostilleAccount = ApostilleAccount.createFromExistAccount(existApostilleAccount, apiEndpoint);
    const apostilleTransaction = new ApostilleTransaction(
      signerAccount,
      apostilleAccount,
      apostilleMessage,
      networkType,
      generationHashSeed,
      feeMultiplier,
    );
    return apostilleTransaction;
  }

  /**
   * 
   * @param hashedData 
   * @param hashingType 
   * @param signerAccount 
   * @param existApostilleAccount 
   * @param networkType 
   * @param generationHashSeed 
   * @param feeMultiplier 
   * @param apiEndpoint 
   */
  public static updateFromHashedData(
    hashedData: string,
    hashingType: HashingType.Type,
    signerAccount: Account,
    existApostilleAccount: Account | PublicAccount,
    networkType: NetworkType,
    generationHashSeed: string,
    feeMultiplier: number,
    apiEndpoint: string,
  ) {
    const hashFunc = HashFunctionCreator.create(hashingType);
    const apostilleMessage = hashFunc.createApostilleTransactionMessageFromHashedData(
      hashedData, signerAccount
    );
    const apostilleAccount = ApostilleAccount.createFromExistAccount(existApostilleAccount, apiEndpoint);
    const apostilleTransaction = new ApostilleTransaction(
      signerAccount,
      apostilleAccount,
      apostilleMessage,
      networkType,
      generationHashSeed,
      feeMultiplier,
    );
    return apostilleTransaction;
  }

  private constructor(
    public readonly signerAccount: Account,
    public readonly apostilleAccount: ApostilleAccount,
    private readonly apostilleMessage: string,
    private readonly networkType: NetworkType,
    private readonly generationHashSeed: string,
    private readonly feeMultiplier: number,
    private readonly options?: IApostilleOptions,
  ) {
    this.createCoreTransaction();
    this.createAssignOwnershipTransaction();
    this.createMetadataTransactions();
  }

  /**
   * 
   */
  public async singedTransactionAndAnnounceType() {
    const innerTxs = this.convertInnerTransactions();
    const aggregateTx = await this.createAggregateTransaction(innerTxs);
    const signedTx = this.signTransaction(aggregateTx);
    const shouldUseHashLockTx = this.shouldUseHashLockTransaction();
    const announceInfo: AnnounceInfo = {
      signedTransaction: signedTx,
      shouldUseHashLockTransaction: shouldUseHashLockTx
    };
    return announceInfo;
  }

  private shouldUseHashLockTransaction() {
    switch(this.announceType) {
      case AnnounceType.BondedWithApostilleAccountSing:
      case AnnounceType.BondedWithoutApostilleAccountSing:
        return true;
      default:
        return false;
    }
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

  private convertInnerTransactions() {
    const innerTxs: InnerTransaction[] = []
    if (this.coreTransaction) {
      const innerTx = this.coreTransaction.toAggregate(this.signerAccount.publicAccount);
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
    return innerTxs;
  }

  private async createAggregateTransaction(innerTxs: InnerTransaction[]) {
    await this.setAnnounceType();
    switch(this.announceType) {
      case AnnounceType.CompleteWithApostilleAccountSign:
      case AnnounceType.CompleteWithoutApostilleAccountSing:
        return this.createCompleteTransaction(innerTxs);
      case AnnounceType.BondedWithApostilleAccountSing:
      case AnnounceType.BondedWithoutApostilleAccountSing:
        return this.createBondedTransaction(innerTxs);
      default:
        throw Error('Can not create aggregate transaction');
    }
  }

  private createCompleteTransaction(innerTxs: InnerTransaction[]) {
    const signerCount = this.getSignerCount();
    const tx = AggregateTransaction.createComplete(
      Deadline.create(),
      innerTxs,
      this.networkType,
      []
    ).setMaxFeeForAggregate(this.feeMultiplier, signerCount);
    return tx;
  }

  private createBondedTransaction(innerTxs: InnerTransaction[]) {
    const singerCount = this.getSignerCount();
    const tx = AggregateTransaction.createBonded(
      Deadline.create(),
      innerTxs,
      this.networkType,
      []
    ).setMaxFeeForAggregate(this.feeMultiplier, singerCount);
    return tx;
  }

  private signTransaction(aggregateTx: AggregateTransaction) {
    switch(this.announceType) {
      case AnnounceType.CompleteWithApostilleAccountSign:
      case AnnounceType.BondedWithApostilleAccountSing:
        return this.signTransactionWithApostilleAccount(aggregateTx)
      case AnnounceType.CompleteWithoutApostilleAccountSing:
      case AnnounceType.BondedWithoutApostilleAccountSing:
        return this.signTransactionWithoutApostilleAccount(aggregateTx);
      default:
        throw Error('Can not sign transaction');
    }
  }

  private signTransactionWithApostilleAccount(aggregateTx: AggregateTransaction) {
    if (this.apostilleAccount.account) {
      const signedTx = this.signerAccount.signTransactionWithCosignatories(
        aggregateTx,
        [this.apostilleAccount.account],
        this.generationHashSeed,
      );
      return signedTx;
    }
    throw Error('Can not sign transaction');
  }

  private signTransactionWithoutApostilleAccount(aggregateTx: AggregateTransaction) {
    const signedTx = this.signerAccount.sign(
      aggregateTx,
      this.generationHashSeed,
    );
    return signedTx;
  }

  private getSignerCount() {
    if (this.announceType === AnnounceType.CompleteWithoutApostilleAccountSing) {
      return 1;
    }
    if (this.announceType === AnnounceType.CompleteWithApostilleAccountSign) {
      return 2;
    }
    if (this.announceType === AnnounceType.BondedWithApostilleAccountSing &&
      this.options && this.options.assignOwners) {
      return 2 + this.options.assignOwners.length;
    }
    if (this.announceType === AnnounceType.BondedWithoutApostilleAccountSing) {
      return this.apostilleAccount.multisigInfo!.minApproval;
    }
    throw Error('Can not announce transaction');
  }

  private async setAnnounceType() {
    await this.apostilleAccount.getMultisigAccountInfo();
    if (this.apostilleAccount.multisigInfo) {
      const {multisigInfo} = this.apostilleAccount;
      if (multisigInfo.minApproval >= 2) {
        this.announceType = AnnounceType.BondedWithoutApostilleAccountSing;
      }
      if (multisigInfo.minApproval === 1 &&
          multisigInfo.hasCosigner(this.signerAccount.address)) {
        this.announceType = AnnounceType.CompleteWithoutApostilleAccountSing;
      }
      if (multisigInfo.minApproval === 1 &&
          !multisigInfo.hasCosigner(this.signerAccount.address)) {
        this.announceType = AnnounceType.CannotAnnounce;
      }
    }
    if (this.options && this.options.assignOwners) {
      if (this.options.assignOwners.length === 1 &&
        this.options.assignOwners.includes(this.signerAccount.address)) {
        this.announceType = AnnounceType.CompleteWithApostilleAccountSign;
      }
      this.announceType = AnnounceType.BondedWithApostilleAccountSing;
    }
    if (this.metaDataTransactions) {
      this.announceType = AnnounceType.CompleteWithApostilleAccountSign;
    }
    this.announceType = AnnounceType.CompleteWithoutApostilleAccountSing;
  }
}

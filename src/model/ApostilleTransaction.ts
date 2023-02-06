import { Account, MultisigAccountModificationTransaction, AccountMetadataTransaction, TransferTransaction, Deadline, PlainMessage, NetworkType, InnerTransaction, PublicAccount, AggregateTransaction , Convert } from "symbol-sdk";

import { HashingType, HashFunctionCreator, DataView } from "../utils/hash";
import { MetadataKeyHelper } from "../utils/MetadataKeyHelper";
import { ApostilleAccount } from "./ApostilleAccount";
import { IApostilleOptions } from "./ApostilleOptions";
import { AnnounceInfo } from "./AnnounceInfo";


export enum AnnounceType {
  CompleteWithApostilleAccountSign,
  CompleteWithoutApostilleAccountSign,
  BondedWithApostilleAccountSign,
  BondedWithoutApostilleAccountSign,
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
   * @param signerAccount 
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
    signerAccount: Account,
    networkType: NetworkType,
    generationHashSeed: string,
    feeMultiplier: number,
    apiEndpoint: string,
    epochAdjustment: number,
    options?: IApostilleOptions,
    ) {
      const hashFunc = HashFunctionCreator.create(hashingType);
      const apostilleMessage = hashFunc.createApostilleTransactionMessage(data, signerAccount);
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
        epochAdjustment,
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
   * @param epochAdjustment 
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
    epochAdjustment: number,
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
        epochAdjustment,
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
   * @param epochAdjustment 
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
    epochAdjustment: number,
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
      epochAdjustment,
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
   * @param epochAdjustment 
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
    epochAdjustment: number,
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
      epochAdjustment,
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
    private readonly epochAdjustment: number,
    private readonly options?: IApostilleOptions,
  ) {
    this.createCoreTransaction();
    this.createAssignOwnershipTransaction();
    this.createMetadataTransactions();
  }

  /**
   * 
   */
  public async signedTransactionAndAnnounceType() {
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
      case AnnounceType.BondedWithApostilleAccountSign:
      case AnnounceType.BondedWithoutApostilleAccountSign:
        return true;
      default:
        return false;
    }
  }

  private createCoreTransaction() {
    const tx = TransferTransaction.create(
      Deadline.create(this.epochAdjustment),
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
        Deadline.create(this.epochAdjustment),
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
          Deadline.create(this.epochAdjustment),
          this.apostilleAccount.publicAccount.address,
          MetadataKeyHelper.keyToKeyId(k),
          Convert.utf8ToUint8(v).byteLength,
          Convert.utf8ToUint8(v),
          this.networkType
        );
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
      case AnnounceType.CompleteWithoutApostilleAccountSign:
        return this.createCompleteTransaction(innerTxs);
      case AnnounceType.BondedWithApostilleAccountSign:
      case AnnounceType.BondedWithoutApostilleAccountSign:
        return this.createBondedTransaction(innerTxs);
      default:
        throw Error('Can not create aggregate transaction');
    }
  }

  private createCompleteTransaction(innerTxs: InnerTransaction[]) {
    const signerCount = this.getSignerCount();
    const tx = AggregateTransaction.createComplete(
      Deadline.create(this.epochAdjustment),
      innerTxs,
      this.networkType,
      []
    ).setMaxFeeForAggregate(this.feeMultiplier, signerCount);
    return tx;
  }

  private createBondedTransaction(innerTxs: InnerTransaction[]) {
    const signerCount = this.getSignerCount();
    const tx = AggregateTransaction.createBonded(
      Deadline.create(this.epochAdjustment),
      innerTxs,
      this.networkType,
      []
    ).setMaxFeeForAggregate(this.feeMultiplier, signerCount);
    return tx;
  }

  private signTransaction(aggregateTx: AggregateTransaction) {
    switch(this.announceType) {
      case AnnounceType.CompleteWithApostilleAccountSign:
      case AnnounceType.BondedWithApostilleAccountSign:
        return this.signTransactionWithApostilleAccount(aggregateTx)
      case AnnounceType.CompleteWithoutApostilleAccountSign:
      case AnnounceType.BondedWithoutApostilleAccountSign:
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
    if (this.announceType === AnnounceType.CompleteWithoutApostilleAccountSign) {
      return 1;
    }
    if (this.announceType === AnnounceType.CompleteWithApostilleAccountSign) {
      return 2;
    }
    if (this.announceType === AnnounceType.BondedWithApostilleAccountSign &&
      this.options && this.options.assignOwners) {
      return 2 + this.options.assignOwners.length;
    }
    if (this.announceType === AnnounceType.BondedWithoutApostilleAccountSign) {
      return this.apostilleAccount.multisigInfo!.minApproval;
    }
    throw Error('Can not announce transaction');
  }

  private async setAnnounceType() {
    await this.apostilleAccount.getMultisigAccountInfo();
    if (this.apostilleAccount.multisigInfo) {
      const {multisigInfo} = this.apostilleAccount;
      if (multisigInfo.minApproval >= 2) {
        this.announceType = AnnounceType.BondedWithoutApostilleAccountSign;
        return;
      }
      if (multisigInfo.minApproval === 1 &&
          multisigInfo.hasCosigner(this.signerAccount.address)) {
        this.announceType = AnnounceType.CompleteWithoutApostilleAccountSign;
        return;
      }
      if (multisigInfo.minApproval === 1 &&
          !multisigInfo.hasCosigner(this.signerAccount.address)) {
        this.announceType = AnnounceType.CannotAnnounce;
        return;
      }
    }
    if (this.options && this.options.assignOwners) {
      if (this.options.assignOwners.length === 1 &&
        this.options.assignOwners.includes(this.signerAccount.address)) {
        this.announceType = AnnounceType.CompleteWithApostilleAccountSign;
        return;
      }
      this.announceType = AnnounceType.BondedWithApostilleAccountSign;
      return;
    }
    if (this.metaDataTransactions) {
      this.announceType = AnnounceType.CompleteWithApostilleAccountSign;
      return;
    }
    this.announceType = AnnounceType.CompleteWithoutApostilleAccountSign;
  }
}

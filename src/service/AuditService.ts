import { lastValueFrom } from "rxjs";
import { RepositoryFactoryHttp, TransactionGroup, AggregateTransaction, TransferTransaction, UInt64, BlockInfo, Address, MultisigAccountModificationTransaction, TransactionStatusHttp } from "symbol-sdk";
import { IAuditResult, IPartialTxAuditResult, AuditType, IApostilleTxMessage } from "../model";
import { HashFunctionCreator, DataView } from "../utils/hash";

export class AuditService {
  private readonly repositoryFactory: RepositoryFactoryHttp;

  public static async audit(
    data: DataView,
    txHash: string,
    apiEndpoint: string,
  ) {
    const transactionStatusHttp = new TransactionStatusHttp(apiEndpoint);
    const status = await lastValueFrom(transactionStatusHttp.getTransactionStatus(txHash));
    if (status.group === 'confirmed') {
      const result = await this.auditWithComplete(data, txHash, apiEndpoint);
      return result;
    }
    if (status.group === 'partial') {
      const result = await this.auditWithPartial(data, txHash, apiEndpoint);
      return result;
    }
    throw Error('transaction not found');
  }

  public static async auditWithComplete(
    data: DataView,
    txHash: string,
    apiEndpoint: string,
  ) {
    const service = new AuditService(data, txHash, apiEndpoint);
    const result = await service.auditWithConfirmed();
    return result;
  }

  public static async auditWithPartial(
    data: DataView,
    txHash: string,
    apiEndpoint: string,
  ) {
    const service = new AuditService(data, txHash, apiEndpoint);
    const result = await service.auditWithPartial();
    return result;
  }

  constructor(
    private readonly data: DataView,
    private readonly txHash: string,
    apiEndpoint: string,
  ) {
    this.repositoryFactory = new RepositoryFactoryHttp(apiEndpoint);
  }

  private async auditWithConfirmed() {
    const coreTx = await this.getTransaction();
    const signerPublicAccount = coreTx.signer!;
    const parsedMessage = this.parseMessage(coreTx.message.payload);
    const hashFunction = HashFunctionCreator.createWithTypeStr(parsedMessage.hashingTypeStr);
    const hashedData = hashFunction.hashing(this.data);
    const isValid = signerPublicAccount.verifySignature(hashedData, parsedMessage.signedHash);
    if (isValid) {
      const signer = coreTx.signer!.address;
      const apostilleAccount = coreTx.recipientAddress as Address;
      const timestamp = await this.getTimestamp(coreTx.transactionInfo!.height);
      const result: IAuditResult = {
        isValid: true,
        type: AuditType.Confirmed,
        signer,
        apostilleAccount,
        timestamp
      }
      return result;
    }
    const result: IAuditResult = { isValid: false };
    return result;
  }

  private async auditWithPartial() {
    const tx = await this.getTransactionFromPartial();
    const coreTx = this.getCoreTx(tx);
    const signerPublicAccount = coreTx.signer!;
    const parsedMessage = this.parseMessage(coreTx.message.payload);
    const hashFunction = HashFunctionCreator.createWithTypeStr(parsedMessage.hashingTypeStr);
    const hashedData = hashFunction.hashing(this.data);
    const isValid = signerPublicAccount.verifySignature(hashedData, parsedMessage.signedHash);
    if (isValid) {
      const signer = coreTx.signer!.address;
      const apostilleAccount = coreTx.recipientAddress as Address;
      const multisigTx = this.getMultisigTx(tx);
      const additions = multisigTx.addressAdditions;
      const cosignatories = this.getCosignatories(tx);
      const result: IPartialTxAuditResult = {
        isValid: true,
        type: AuditType.Partial,
        signer,
        apostilleAccount,
        multisigAdditional: additions,
        cosignatories
      };
      return result;
    }
    const result: IPartialTxAuditResult = {
      isValid: false,
    };
    return result;
  }

  private async getTimestamp(blockHight: UInt64) {
    const blockRep = this.repositoryFactory.createBlockRepository();
    const blockInfo: BlockInfo = await lastValueFrom(blockRep.getBlockByHeight(blockHight));
    const t = Number(blockInfo.timestamp.toString());
    const epochAdjustment = await this.getEpochAdjustment();
    return new Date(t + epochAdjustment * 1000);
  }

  private async getEpochAdjustment() {
    const epochAdjustment = await lastValueFrom(this.repositoryFactory.getEpochAdjustment());
    return epochAdjustment;
  }

  private parseMessage(txMessage: string) {
    const regex = /^fe4e5459(\d{2})(\w+)/
    const result = txMessage.match(regex);
    if (result) {
      const parsedMessage: IApostilleTxMessage = {
        hashingTypeStr: result[1],
        signedHash: result[2],
      };
      return parsedMessage;
    }
    throw Error('It is not apostille message');
  }

  private async getTransaction() {
    const transactionRep = this.repositoryFactory.createTransactionRepository();
    const tx = await lastValueFrom(transactionRep.getTransaction(this.txHash, TransactionGroup.Confirmed));
    if (tx instanceof AggregateTransaction) {
      const coreInnerTx = tx.innerTransactions.find(t => t instanceof TransferTransaction && t.message.payload.startsWith('fe4e5459'));
      if (coreInnerTx) {
        return coreInnerTx as TransferTransaction;
      }
      throw Error('It is not apostille transaction');
    } else {
      throw Error('It is not apostille transaction');
    }
  }

  private async getTransactionFromPartial() {
    const transactionRep = this.repositoryFactory.createTransactionRepository();
    const tx = await lastValueFrom(transactionRep.getTransaction(this.txHash, TransactionGroup.Partial));
    if (tx instanceof AggregateTransaction) {
      const coreInnerTx = tx.innerTransactions.find(t => t instanceof TransferTransaction && t.message.payload.startsWith('fe4e5459'));
      if (coreInnerTx) {
        return tx;
      }
      throw Error('It is not apostille transaction');
    } else {
      throw Error('It is not apostille transaction');
    }
  }

  private getCoreTx(tx: AggregateTransaction) {
    const coreTx = tx.innerTransactions.find(t => t instanceof TransferTransaction && t.message.payload.startsWith('fe4e5459'));
    if (coreTx) {
      return coreTx as TransferTransaction;
    }
    throw Error('It is not apostille transaction');
  }

  private getMultisigTx(tx: AggregateTransaction) {
    const multisigTx = tx.innerTransactions.find(t => t instanceof MultisigAccountModificationTransaction);
    if (multisigTx) {
      return multisigTx as MultisigAccountModificationTransaction;
    }
    throw Error('It is not contain multisig tx');
  }

  private getCosignatories(tx: AggregateTransaction) {
    const cosignatories: Address[] = [];
    tx.cosignatures.forEach((c) => {
      cosignatories.push(c.signer.address);
    })
    return cosignatories;
  }
}

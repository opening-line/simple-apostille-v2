import { RepositoryFactoryHttp, TransactionGroup, AggregateTransaction, TransferTransaction, UInt64, BlockInfo, Address } from "symbol-sdk";
import { IAuditResult } from "@src/model";
import { IApostilleTxMessage } from "../model/ApostilleTxMessage";
import { HashFunctionCreator } from "../utils/hash";

export class AuditService {
  private readonly repositoryFactory: RepositoryFactoryHttp;

  public static async audit(
    data: string,
    txHash: string,
    apiEndpoint: string,
  ) {
    const service = new AuditService(data, txHash, apiEndpoint);
    const result = await service.audit();
    return result;
  }

  constructor(
    private readonly data: string,
    private readonly txHash: string,
    apiEndpoint: string,
  ) {
    this.repositoryFactory = new RepositoryFactoryHttp(apiEndpoint);
  }

  private async audit() {
    const coreTx = await this.getTransaction();
    const ownerPublicAccount = coreTx.signer!;
    const parsedMessage = this.parseMessage(coreTx.message.payload);
    const hashFunction = HashFunctionCreator.createWithTypeStr(parsedMessage.hashingTypeStr);
    const hashedData = hashFunction.hashing(this.data);
    const isValid = ownerPublicAccount.verifySignature(hashedData, parsedMessage.signedHash);
    if (isValid) {
      const owner = coreTx.signer!.address;
      const apostilleAccount = coreTx.recipientAddress as Address;
      const timestamp = await this.getTimestamp(coreTx.transactionInfo!.height);
      const result: IAuditResult = {
        isValid: true,
        owner,
        apostilleAccount,
        timestamp
      }
      return result;
    }
    const result: IAuditResult = { isValid: false };
    return result;
  }

  private async getTimestamp(blockHight: UInt64) {
    const blockRep = this.repositoryFactory.createBlockRepository();
    const blockInfo: BlockInfo = await blockRep.getBlockByHeight(blockHight).toPromise();
    const t = Number(blockInfo.timestamp.toString());
    return new Date(t + 1573430400000);
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
    const tx = await transactionRep.getTransaction(this.txHash, TransactionGroup.Confirmed).toPromise();
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
}

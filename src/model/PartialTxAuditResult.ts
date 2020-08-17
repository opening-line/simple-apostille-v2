import { Address, UnresolvedAddress } from 'symbol-sdk';
import { AuditType } from './AuditResult';

export interface IPartialTxAuditResult {
  isValid: boolean;
  type?: AuditType;
  signer?: Address;
  apostilleAccount?: Address;
  multisigAdditional?: UnresolvedAddress[];
  cosignatories?: Address[];
}

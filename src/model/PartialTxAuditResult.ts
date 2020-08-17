import { Address, UnresolvedAddress } from 'symbol-sdk';

export interface IPartialTxAuditResult {
  isValid: boolean;
  signer?: Address;
  apostilleAccount?: Address;
  multisigAdditional?: UnresolvedAddress[];
  cosignatories?: Address[];
}

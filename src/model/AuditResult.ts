import { Address } from "symbol-sdk";

export enum AuditType {
  Confirmed,
  Partial,
}

export interface IAuditResult {
  isValid: boolean;
  type?: AuditType;
  signer?: Address;
  apostilleAccount?: Address;
  timestamp?: Date;
}

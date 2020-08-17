import { Address } from "symbol-sdk";

export interface IAuditResult {
  isValid: boolean;
  signer?: Address;
  apostilleAccount?: Address;
  timestamp?: Date;
}

import { Address } from "symbol-sdk";

export interface IAuditResult {
  isValid: boolean;
  owner?: Address;
  apostilleAccount?: Address;
  timestamp?: Date;
}

import { Address } from "symbol-sdk";
import { IApostilleMetadata } from "./ApostilleMetadata";

export interface IApostilleOptions {
  assignOwners?: Address[];
  metadata?: IApostilleMetadata;
}

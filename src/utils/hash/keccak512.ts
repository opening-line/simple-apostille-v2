import { keccak512 } from "js-sha3";
import { HashFunction } from "./HashFunction";
import { HashingType } from "./HashingType";

export class KECCAK512 extends HashFunction {
  constructor() {
    super(HashingType.Type.keccak512);
  }

  public hashing(data: string) {
    return keccak512.update(data).hex();
  }
}

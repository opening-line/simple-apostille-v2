import { sha3_512 } from "js-sha3";
import { HashFunction } from "./HashFunction";
import { HashingType } from "./HashingType";

export class SHA3_512 extends HashFunction {
  constructor() {
    super(HashingType.Type.sha3_512);
  }

  public hashing(data: string) {
    return sha3_512.update(data).hex();
  }
}

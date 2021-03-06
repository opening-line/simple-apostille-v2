import { sha3_256 } from "js-sha3";
import { HashFunction, DataView } from "./HashFunction";
import { HashingType } from "./HashingType";

export class SHA3_256 extends HashFunction {
  constructor() {
    super(HashingType.Type.sha3_256);
  }

  public hashing(data: DataView) {
    return sha3_256.update(data).hex();
  }
}

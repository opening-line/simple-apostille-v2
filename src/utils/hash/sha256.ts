import { sha256 } from 'js-sha256';
import { HashFunction, DataView } from "./HashFunction";
import { HashingType } from "./HashingType";

export class SHA256 extends HashFunction {
  constructor() {
    super(HashingType.Type.sha256);
  }

  public hashing(data: DataView) {
    return sha256.update(data).hex();
  }
}

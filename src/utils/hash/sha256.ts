import { createHash } from "crypto";
import { HashFunction } from "./HashFunction";
import { HashingType } from "./HashingType";

export class SHA256 extends HashFunction {
  constructor() {
    super(HashingType.Type.sha256);
  }

  public hashing(data: string) {
    const hashFunc = createHash('sha256');
    hashFunc.update(data);
    return hashFunc.digest('hex');
  }
}

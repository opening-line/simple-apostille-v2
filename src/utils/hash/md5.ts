import { createHash } from "crypto";
import { HashFunction } from "./HashFunction";
import { HashingType } from "./HashingType";

export class MD5 extends HashFunction {
  constructor() {
    super(HashingType.Type.md5);
  }

  public hashing(data: string) {
    const hashFunc = createHash('md5');
    hashFunc.update(data);
    return hashFunc.digest('hex');
  }
}

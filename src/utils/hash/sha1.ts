import { createHash } from "crypto";
import { HashFunction } from "./HashFunction";
import { HashingType } from "./HashingType";


export class SHA1 extends HashFunction {
  constructor() {
    super(HashingType.Type.sha1);
  }

  public hashing(data: string) {
    const hashFunc = createHash('sha1');
    hashFunc.update(data);
    return hashFunc.digest('hex');
  }
}

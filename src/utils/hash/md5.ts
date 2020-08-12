import { HashFunction, DataView } from "./HashFunction";
import { HashingType } from "./HashingType";

export class MD5 extends HashFunction {
  constructor() {
    super(HashingType.Type.md5);
  }

  public hashing(data: DataView) {
    // eslint-disable-next-line global-require
    const md5 = require('js-md5');
    const hash = md5.create();
    hash.update(data);
    return hash.hex();
  }
}

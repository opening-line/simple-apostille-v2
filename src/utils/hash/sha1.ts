import { HashFunction, DataView } from "./HashFunction";
import { HashingType } from "./HashingType";


export class SHA1 extends HashFunction {
  constructor() {
    super(HashingType.Type.sha1);
  }

  public hashing(data: DataView) {
    // eslint-disable-next-line global-require
    const sha1 = require('js-sha1');
    const hash = sha1.create();
    hash.update(data);
    return hash.hex();
  }
}

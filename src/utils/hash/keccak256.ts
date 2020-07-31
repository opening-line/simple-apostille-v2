import { keccak256 } from 'js-sha3';
import { HashFunction } from "./HashFunction";
import { HashingType } from "./HashingType";

export class KECCAK256 extends HashFunction {
  constructor() {
    super(HashingType.Type.keccak256);
  }

  public hashing(data: string) {
    return keccak256.update(data).hex();
  }
}

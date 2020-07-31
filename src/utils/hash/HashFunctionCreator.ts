import { HashingType } from "./HashingType";
import { MD5 } from "./md5";
import { SHA1 } from "./sha1";
import { SHA256 } from "./sha256";
import { KECCAK256 } from "./keccak256";
import { KECCAK512 } from "./keccak512";
import { SHA3_256 } from "./sha3_256";
import { SHA3_512 } from "./sha3_512";

export class HashFunctionCreator {
  static create(type: HashingType.Type) {
    switch(type) {
      case HashingType.Type.md5:       return new MD5();
      case HashingType.Type.sha1:      return new SHA1();
      case HashingType.Type.sha256:    return new SHA256();
      case HashingType.Type.keccak256: return new KECCAK256();
      case HashingType.Type.keccak512: return new KECCAK512();
      case HashingType.Type.sha3_256:  return new SHA3_256();
      case HashingType.Type.sha3_512:  return new SHA3_512();
      default: throw Error('hashing type unmatched');
    }
  }
}

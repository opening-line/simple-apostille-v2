export namespace HashingType {
  export enum Type {
    md5       = '81',
    sha1      = '82',
    sha256    = '83',
    keccak256 = '88',
    keccak512 = '89',
    sha3_256  = '90',
    sha3_512  = '91',
  }

  export function hashTypeStrToType(typeStr: string) {
    switch(typeStr) {
      case '81': return HashingType.Type.md5;
      case '82': return HashingType.Type.sha1;
      case '83': return HashingType.Type.sha256;
      case '88': return HashingType.Type.keccak256;
      case '89': return HashingType.Type.keccak512;
      case '90': return HashingType.Type.sha3_256;
      case '91': return HashingType.Type.sha3_512;
      default: throw Error('unmatched hashing type');
    }
  }
}

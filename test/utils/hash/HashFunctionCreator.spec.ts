import { HashFunctionCreator, HashingType, MD5, SHA1, SHA256, KECCAK256, KECCAK512, SHA3_256, SHA3_512 } from "../../../src/utils/hash";

describe('Should create hash function', () => {
  it('Should create MD5 function', () => {
    const md5Func = HashFunctionCreator.create(HashingType.Type.md5);
    expect(md5Func).toBeInstanceOf(MD5);
  });

  it('Should create sha1 function', () => {
    const sha1Func = HashFunctionCreator.create(HashingType.Type.sha1);
    expect(sha1Func).toBeInstanceOf(SHA1);
  });

  it('Should create sha256 function', () => {
    const sha256Func = HashFunctionCreator.create(HashingType.Type.sha256);
    expect(sha256Func).toBeInstanceOf(SHA256);
  });

  it('Should create keccak256 function', () => {
    const keccak256Func = HashFunctionCreator.create(HashingType.Type.keccak256);
    expect(keccak256Func).toBeInstanceOf(KECCAK256);
  });

  it('Should create keccak512 function', () => {
    const keccak512Func = HashFunctionCreator.create(HashingType.Type.keccak512);
    expect(keccak512Func).toBeInstanceOf(KECCAK512);
  });

  it('Should create sha3-256 function', () => {
    const sha3_256Func = HashFunctionCreator.create(HashingType.Type.sha3_256);
    expect(sha3_256Func).toBeInstanceOf(SHA3_256);
  });

  it('Should create sha3-512 function', () => {
    const sha3_512Func = HashFunctionCreator.create(HashingType.Type.sha3_512);
    expect(sha3_512Func).toBeInstanceOf(SHA3_512);
  });
});
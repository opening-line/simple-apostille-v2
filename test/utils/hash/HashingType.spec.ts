import { HashingType } from "../../../src/utils/hash";

describe('Should correct hashing type', () => {
  it('Should correct md5 hashing type', () => {
    const type = HashingType.hashTypeStrToType('81');
    expect(type).toEqual(HashingType.Type.md5);
  });

  it('Should correct sha1 hashing type', () => {
    const type = HashingType.hashTypeStrToType('82');
    expect(type).toEqual(HashingType.Type.sha1);
  });

  it('Should correct sha256 hashing type', () => {
    const type = HashingType.hashTypeStrToType('83');
    expect(type).toEqual(HashingType.Type.sha256);
  });

  it('Should correct keccak256 hashing type', () => {
    const type = HashingType.hashTypeStrToType('88');
    expect(type).toEqual(HashingType.Type.keccak256);
  });

  it('Should correct keccak512 hashing type', () => {
    const type = HashingType.hashTypeStrToType('89');
    expect(type).toEqual(HashingType.Type.keccak512);
  });

  it('Should correct sha3-256 hashing type', () => {
    const type = HashingType.hashTypeStrToType('90');
    expect(type).toEqual(HashingType.Type.sha3_256);
  });

  it('Should correct sha3-512 hashing type', () => {
    const type = HashingType.hashTypeStrToType('91');
    expect(type).toEqual(HashingType.Type.sha3_512);
  });

  it('Should throw error', () => {
    expect(() => {
      HashingType.hashTypeStrToType('00');
    }).toThrow();
  });
});

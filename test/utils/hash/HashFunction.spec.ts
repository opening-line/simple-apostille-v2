import { NetworkType, Account } from 'symbol-sdk';
import { MD5, SHA1, SHA256, KECCAK256, KECCAK512, SHA3_256, SHA3_512 } from '../../../src/utils/hash';

describe('Should generate correct hash', () => {
  const signerPrivateKey = 'F1E7660DB9EF5E73203881304F31B7CCDF167A08055013A633D098EBD94FD36F';
  const networkType = NetworkType.TEST_NET;
  const account = Account.createFromPrivateKey(signerPrivateKey, networkType);
  const data = 'I am legen wait for it dary';

  it('Generate hash with MD5', () => {
    const md5 = new MD5();
    const hash = '5bd55f933c48f7745e16cbc20facc571';
    expect(md5.hashing(data)).toEqual(hash);
  });

  it('Generate apostille transaction message with MD5', () => {
    const md5 = new MD5();
    const message = 'fe4e545981E0335394DDD17FBA9BAA3C76D07159F945B1EF33E47930F5FBAA2BB882F11BB4E549E7B57B4C88B98689EDF687101BE6C7344D50E1C509DF265221DC05D57207';
    expect(md5.createApostilleTransactionMessage(data, account)).toEqual(message);
  });

  it('Generate hash with SHA1', () => {
    const sha1 = new SHA1();
    const hash = 'f8ef2e25de9bf2857311c523d6f0ba6b2d050582';
    expect(sha1.hashing(data)).toEqual(hash);
  });

  it('Generate apostille transaction message with SHA1', () => {
    const sha1 = new SHA1();
    const message = 'fe4e545982C273EA42A44F4966FED943BB9EF1C3ABFE2ABA38C7524BB6C8ACA086ECB22248E4B8AED6403D636E0B54EABBB1284235A491A69C192FE25EFF564F52C09CD600';
    expect(sha1.createApostilleTransactionMessage(data, account)).toEqual(message);
  });

  it('Generate hash with SHA256', () => {
    const sha256 = new SHA256();
    const hash = '336eda1a928c499c7cce89373580ed0ba5ab374af90553f0a25e5e32964bb072';
    expect(sha256.hashing(data)).toEqual(hash);
  });

  it('Generate apostille transaction message with SHA256', () => {
    const sha256 = new  SHA256();
    const message = 'fe4e5459831CF9E29E3BFDE4CBA65C21EDEA5319A8E7CBE49F332AAF563D8C908EA1CC273DE337962081B0301F789CAFF9B6003C5BD94DF5F20B63FDF1399640514FA2CC00';
    expect(sha256.createApostilleTransactionMessage(data, account)).toEqual(message);
  });

  it('Generate hash with keccak256', () => {
    const keccak256 = new KECCAK256();
    const hash = '1898ef04e8a181bbaa0d5a047895b1e35c41e31ad046aafe16aa8e4a259f9b0d';
    expect(keccak256.hashing(data)).toEqual(hash);
  });

  it('Generate apostille transaction message with keccak256', () => {
    const keccak256 = new KECCAK256();
    const message = 'fe4e545988BAD74673DF41EF7BEC76A84DF4144C9C02EC7E3555FF8D677BA0A4FE6BC443DAB0A36840BC6D506B332B48953AB347DADA803C2080984AC54FC2B16B59B9330B';
    expect(keccak256.createApostilleTransactionMessage(data, account)).toEqual(message);
  });

  it('Generate hash with keccak512', () => {
    const keccak512 = new KECCAK512();
    const hash = '5dcecc77d075f0ba5ff60d8a6c5d15c1f737998b389c2a24ea741b983c6a156c4b2fff45a143ae87ab1942f1ccd7c288e77b8777915aa7c704cf6c1b88664bf8';
    expect(keccak512.hashing(data)).toEqual(hash);
  });

  it('Generaete apostille transaction message with keccak512', () => {
    const keccak512 = new KECCAK512();
    const message = 
    'fe4e545989754C17936BB1ED1E71EECAAC62A31D660988FE7BE9BE1006144C18F77649743F7A771E27C043E106382DB8B789947B5962486BCA9AC862A4622D2036A4AC6D0F';
    expect(keccak512.createApostilleTransactionMessage(data, account)).toEqual(message);
  });

  it('Generate hash with sha3-256', () => {
    const sha3_256 = new SHA3_256();
    const hash = '5cf87d7284b91dead5535903d952670270ff994248392cd1fd3b7d811a40e64d';
    expect(sha3_256.hashing(data)).toEqual(hash);
  });

  it('Generate apostille transaction message with sha3-256', () => {
    const sha3_256 = new SHA3_256();
    const message = 'fe4e5459907CC13B10CBE2F9BFADFE6EC8CBCDDE1E996B05EA4354CD3508A7642B4D342D5807137DE096D0B16026F6795C5DA339E605A6901F356830A8E68C3C506891580D';
    expect(sha3_256.createApostilleTransactionMessage(data, account)).toEqual(message);
  });

  it('Generaete hash with sha3-512', () => {
    const sha3_512 = new SHA3_512();
    const hash = '509bac41c330c66d7eb4b519172eab319fbdafc6dc360b00c62f74445cdb42c8563a66a0992d7e3bd595cc782d007ce6d200affe0ba9714706c451e4cfb46020';
    expect(sha3_512.hashing(data)).toEqual(hash);
  });

  it('Generate apostille transaction message with sha3-512', () => {
    const sha3_512 = new SHA3_512();
    const message = 'fe4e5459914174CE7B2A84BDCE3CF666A67765DA29386FAB4C71685D1C03ED741A1271C5910E683C20C5C38508A37CD94EF76828ADBA95D6F6D99D6EB4502F9CB899F22204';
    expect(sha3_512.createApostilleTransactionMessage(data, account)).toEqual(message);
  });
});

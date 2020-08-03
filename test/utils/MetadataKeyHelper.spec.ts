import { UInt64 } from "symbol-sdk";

import { MetadataKeyHelper } from '../../src/utils';

describe('Should correct key name from keyId', () => {
  it('Get Author key from keyId', () => {
    const keyId = UInt64.fromHex('B8A2B7186A421369');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('Author');
  });

  it('Get Title kek from keyId', () => {
    const keyId = UInt64.fromHex('A801BEEB799108BC');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('Title');
  });

  it('Get Tag key from keyId', () => {
    const keyId = UInt64.fromHex('EB9BDBED96B9EC45');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('Tag');
  });

  it('Get Description key from keyId', () => {
    const keyId = UInt64.fromHex('9E30087F94867CF9');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('Description');
  });

  it('Get OriginUrl key from keyId', () => {
    const keyId = UInt64.fromHex('9FA2FCC0B88961FC');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('OriginUrl');
  });

  it('Get certificateUrl key from keyId', () => {
    const keyId = UInt64.fromHex('92F13A7B7DF2F7A9');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('CertificateUrl');
  });

  it('Get Filename key from keyId', () => {
    const keyId = UInt64.fromHex('D298EBA89C34461D');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('Filename');
  });

  it('Get Hex key name from keyId', () => {
    const keyId = UInt64.fromHex('0000000000000000');
    const keyName = MetadataKeyHelper.getKeyNameByKeyId(keyId);
    expect(keyName).toEqual('0000000000000000');
  });
});

describe('Should correct keyId from key name', () => {
  it('Get author key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('author');
    expect(keyId.toHex()).toEqual('B8A2B7186A421369');
  });

  it('Get title key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('title');
    expect(keyId.toHex()).toEqual('A801BEEB799108BC');
  });

  it('Get tag key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('tag');
    expect(keyId.toHex()).toEqual('EB9BDBED96B9EC45');
  });

  it('Get description key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('description');
    expect(keyId.toHex()).toEqual('9E30087F94867CF9');
  });

  it('Get filename key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('filename');
    expect(keyId.toHex()).toEqual('D298EBA89C34461D');
  });

  it('Get originUrl key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('originUrl');
    expect(keyId.toHex()).toEqual('9FA2FCC0B88961FC');
  });

  it('Get certificateUrl key id from key name', () => {
    const keyId = MetadataKeyHelper.keyToKeyId('certificateUrl');
    expect(keyId.toHex()).toEqual('92F13A7B7DF2F7A9');
  });
})
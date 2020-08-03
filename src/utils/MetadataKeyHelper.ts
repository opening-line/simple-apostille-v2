import { UInt64, KeyGenerator } from "symbol-sdk";

export enum MetadataKey {
  author = 'B8A2B7186A421369',
  title = 'A801BEEB799108BC',
  tag = 'EB9BDBED96B9EC45',
  description = '9E30087F94867CF9',
  filename = 'D298EBA89C34461D',
  originUrl = '9FA2FCC0B88961FC',
  certificateUrl = '92F13A7B7DF2F7A9',
}

export class MetadataKeyHelper {
  public static getKeyNameByKeyId(keyId: UInt64) {
    switch(keyId.toHex()) {
      case MetadataKey.author:
        return 'Author';
      case MetadataKey.title:
        return 'Title';
      case MetadataKey.tag:
        return 'Tag';
      case MetadataKey.description:
        return 'Description';
      case MetadataKey.originUrl:
        return 'OriginUrl';
      case MetadataKey.certificateUrl:
        return 'CertificateUrl';
      case MetadataKey.filename:
        return 'Filename';
      default:
        return keyId.toHex();
    }
  }

  public static keyToKeyId(key: string) {
    return KeyGenerator.generateUInt64Key(key);
  }
}

import { NetworkType } from 'symbol-sdk';

describe('jest right works', () => {
  it('jest right works', () => {
    expect(NetworkType.TEST_NET.valueOf()).toEqual(NetworkType.TEST_NET.valueOf());
  })
})
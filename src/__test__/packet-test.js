import { InvokePacket } from '../packet'

describe('packet', () => {
  it('throws if the first item is null or undefined', () => {
    expect(() => new InvokePacket())
      .toThrow(Error)
  })

  it('throws if the first item is empty string', () => {
    expect(() => new InvokePacket(''))
      .toThrow(Error)
  })

  it('throws if the seconde item is empty string', () => {
    expect(() => new InvokePacket('network', ''))
      .toThrow(Error)
  })

  it('throws if the seconde item is null or undefined', () => {
    expect(() => new InvokePacket('network'))
      .toThrow(Error)
  })
});


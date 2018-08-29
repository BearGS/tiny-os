// const { RequestPacket } = require('../packet')
import { RequestPacket } from '../packet'

describe('packet', () => {
  it('throws if the first item is null or undefined', () => {
    expect(() => new RequestPacket())
      .toThrow(Error)
  })

  it('throws if the first item is empty string', () => {
    expect(() => new RequestPacket(''))
      .toThrow(Error)
  })

  it('throws if the seconde item is empty string', () => {
    expect(() => new RequestPacket('network', ''))
      .toThrow(Error)
  })

  it('throws if the seconde item is null or undefined', () => {
    expect(() => new RequestPacket('network'))
      .toThrow(Error)
  })
});


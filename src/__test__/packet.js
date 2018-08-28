const { RequestPacket } = require('../packet')

describe('packet', () => {
  console.log(new RequestPacket({
    module: 'module', 
    procedure: 'ppp', 
    params: { a: 1},
  }).toString())

  const a = new RequestPacket({
    module: 'module', 
    procedure: 'ppp', 
    params: { a: 1},
  })
  console.log(a)
  console.log(a.toString())

  it('throws if the first item is null or undefined', () => {
    console.log('')
    expect(() => {
      new RequestPacket()
    })
      .toThrow(Error)
  })

  it('throws if the first item is empty string', () => {
    expect(() => {
      new RequestPacket('')
    })
      .toThrow(Error)
  })

  it('throws if the seconde item is empty string', () => {
    expect(() => {
      new RequestPacket('network', '')
    })
      .toThrow(Error)
  })

  it('throws if the seconde item is null or undefined', () => {
    expect(() => {
      new RequestPacket('network')
    })
      .toThrow(Error)
  })
});


jest.mock('../Router')
import router from '../__mocks__/Router'
import manager from '../AppManager'
import sleep from '../utils/sleep'

const appTestData = [
  {
    name: 'shop',
    url: 'www.shop.ele.me',
    priority: 'temporary',
  },
  {
    name: 'finance',
    url: 'www.finance.ele.me',
    priority: 'temporary',
  },
  {
    name: 'stats',
    url: 'www.stats.ele.me',
    priority: 'temporary',
  },
  {
    name: 'carts',
    url: 'www.carts.ele.me',
    priority: 'temporary',
  },
  {
    name: 'goods',
    url: 'www.goods.ele.me',
    priority: 'temporary',
  },
  {
    name: 'order',
    url: 'www.order.ele.me',
    priority: 'forever'
  }
]

describe('appManager', () => {
  it('throws if name param is null or undefined or empty string or non-string', () => {
    expect(() => {
      manager.register()
    })
      .toThrowError('Invalid params name')
  })
  
  it('throws if url param is null or undefined or empty string or non-string', () => {
    expect(() => {
      manager.register({ 
        name: 'sdf',
        url: '',
      })
    })
      .toThrow('Invalid params url')
  })

  it('should register and launch all right', async () => {
    manager.registerAll(appTestData)

    expect(() => manager.launch('non-app'))
      .toThrow('No such App named `non-app`')
    expect(manager.getApps().length).toBe(6)
    expect(manager.getApps()[0].name).toBe('order')
    
    manager.launch('goods')
    expect(manager.getUnloadApps().length).toBe(5)
    await(sleep(10))

    manager.launch('shop')
    expect(manager.getUnloadApps().length).toBe(4)
    await(sleep(10))

    manager.launch('order')
    expect(manager.getUnloadApps().length).toBe(3)
    await(sleep(10))

    manager.launch('stats')
    expect(manager.getUnloadApps().length).toBe(2)
    await(sleep(10))

    manager.launch('carts')
    expect(manager.getUnloadApps().length).toBe(1)
    await(sleep(10))

    manager.launch('finance')
    expect(manager.getUnloadApps().length).toBe(1)
    await(sleep(10))

    expect(manager.getBackendApps().length).toBe(4)
    expect(manager.getBackendApps()[0].name).toBe('order')
    expect(manager.getBackendApps()[1].name).toBe('carts')
    expect(manager.getFrontendApps().length).toBe(1)
  })
})


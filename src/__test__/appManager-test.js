jest.mock('../Router')
jest.mock('../MomOS')
import router from '../__mocks__/Router'
import mom from '../__mocks__/MomOS'
import manager from '../AppManager'
import sleep from '../utils/sleep'

const appTestData = [
  {
    name: 'shop',
    url: 'www.shop.com',
    priority: 'temporary',
  },
  {
    name: 'finance',
    url: 'www.finance.com',
    priority: 'temporary',
  },
  {
    name: 'stats',
    url: 'www.stats.com',
    priority: 'temporary',
  },
  {
    name: 'carts',
    url: 'www.carts.com',
    priority: 'temporary',
  },
  {
    name: 'goods',
    url: 'www.goods.com',
    priority: 'temporary',
  },
  {
    name: 'order',
    url: 'www.order.com',
    priority: 'forever'
  }
]

describe('appManager', () => {
  it('throws if name param is null or undefined or empty string or non-string', () => {
    expect(() => {
      manager.register()
    })
      .toThrowError('param `name` must not be null or undefined')
  })
  
  it('throws if url param is null or undefined or empty string or non-string', () => {
    expect(() => {
      manager.register({ 
        name: 'sdf',
        url: '',
      })
    })
      .toThrow('param `url` must not be empty string')
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


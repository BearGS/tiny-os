// /* eslint-disable no-param-reassign */
import MomOS from './MomOS'
import router from './Router'
import appManager from './AppManager'
import moduleManager from './ModuleManager'
import { BroadcastEvent } from './constants'

let mom

export default class Os {
  constructor (configs) {
    if (typeof Os.instance === 'object'
      && Os.instance instanceof Os) {
      return Os.instance
    }

    Object.defineProperty(Os, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })

    mom = new MomOS()
    this.init(configs)
  }

  launchApp = appName => {
    appManager.launch(appName)
    mom.broadcast({
      eventName: BroadcastEvent.LAUNCH_APP,
      payload: { appName },
    })
  }

  registerApp = app => appManager.register(app)
  registerAll = apps => appManager.registerAll(apps)
  use = module => moduleManager.use(module)
  useAll = modules => moduleManager.useAll(modules)
  configContainer = container => router.configContainer(container)

  init = ({
    apps = [],
    modules = [],
    container,
    maxAppNum,
    // expiredTime = EXPIRED_TIME,
  } = {}) => {
    router.configContainer(container)
    appManager.configMaxAppNum(maxAppNum)
    appManager.registerAll(apps)
    moduleManager.useAll(modules)
  }

  invoke = packet => mom.invoke(packet)

  registerMethod = (methodName, method) => {
    mom.on(methodName, async packet => {
      const { id, payload } = packet
      try {
        const result = await method(payload)
        mom.handleResponse({ id, result })
      } catch (e) {
        mom.handleResponse({
          id,
          result: {
            error: true,
            errorMessage: e.message,
          }
        })
      }
    })
  }
}


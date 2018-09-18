// /* eslint-disable no-param-reassign */
import MomOS from './MomOS'
import router from './Router'
import appManager from './AppManager'
import { EventPacket } from './packet'
import moduleManager from './ModuleManager'
import { sendToChildIframe } from './utils/communication'

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

  launchApp = app => appManager.launch(app)
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

  broadcast = message => {
    appManager
      .getLoadedApps()
      .forEach(app => sendToChildIframe(app.iframe, new EventPacket(message)))
  }

  invoke = packet => mom.invoke(packet)

  registerMethod = (methodName, method) => {
    mom.on(methodName, async packet => {
      const { payload } = packet
      try {
        const result = await method(payload)
        mom.response({ ...packet, payload: { result } })
      } catch (e) {
        mom.response({
          ...packet,
          payload: {
            error: true,
            errorMessage: e.message,
          }
        })
      }
    })
  }
}


// /* eslint-disable no-param-reassign */
import mom from './Mom'
import router from './Router'
import appManager from './AppManager'
import moduleManager from './ModuleManager'
import { EventPacket, InvokePacket } from './packet'
import { sendToChildIframe } from './utils/communication'

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

  invoke = invokePacket => mom.invoke(new InvokePacket(invokePacket))
}


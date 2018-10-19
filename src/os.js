// /* eslint-disable no-param-reassign */
import mom from './MomOS'
import router from './Router'
import Kernel from './Kernel'
import Storage from './utils/storage'
import appManager from './AppManager'
import moduleManager from './ModuleManager'
import { BroadcastEvent } from './constants'

class Os extends Kernel {
  constructor (configs) {
    super()
    // appManager.configMom(mom)
    mom.on(BroadcastEvent.LAUNCH_APP, packet => {
      const { appName } = packet.payload
      this.launchApp(appName)
    })
    router.listen(this.onOuterAppChange.bind(this))
  }

  launchApp = appName => appManager.launch(appName)

  // outer hash change. for example: click a link with hash
  onOuterAppChange = ({ hash: appName = '' }) => {
    if (!appName) return
    const app = appManager.hasApp(appName)

    if (!app) {
      appManager.suspendOpendApp()
    } else {
      this.launchApp(appName)
    }
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
    methods = {},
    values = {},
    // expiredTime = EXPIRED_TIME,
  } = {}) => {
    Object.keys(methods).forEach(key => this.registerMethod(key, methods[key]))
    Object.keys(values).forEach(key => this.registerValue(key, values[key]))
    router.configContainer(container)
    appManager.configMaxAppNum(maxAppNum)
    appManager.registerAll(apps)
    moduleManager.useAll(modules)
  }

  invoke = packet => mom.invoke(packet)

  registerMethod = (methodName, method) => {
    mom.on(methodName, async packet => {
      const { id, payload } = packet
      let result
      try {
        if (typeof method === 'function') {
          result = await method(payload)
        } else {
          result = await method
        }
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

  registerValue = (key, value) => Storage.setItem(key, value)
  deleteValue = key => Storage.deleteItem(key)
}

export default new Os()

// /* eslint-disable no-param-reassign */
import mom from './MomOS'
import router from './Router'
import Kernel from './Kernel'
import Storage from './utils/storage'
import appManager from './AppManager'
import moduleManager from './ModuleManager'
import { HandleAppEvent, OsStateModifyEvent } from './constants'
import { checkTypeString } from './utils/checkType'

let CURRENT_APP_NAME

class Os extends Kernel {
  constructor () {
    super()

    mom.on(HandleAppEvent.LAUNCH_APP, packet =>
      this.launchApp(packet.payload.appName))

    mom.on(OsStateModifyEvent.APP_CHANGE, ({ appName }) => {
      CURRENT_APP_NAME = appName
    })

    router.listen(this.onOuterAppChange.bind(this))
  }

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

  initialed = false
  invoke = packet => mom.invoke(packet)
  use = module => moduleManager.use(module)
  deleteValue = key => Storage.deleteItem(key)
  registerApp = app => appManager.register(app)
  useAll = modules => moduleManager.useAll(modules)
  launchApp = appName => appManager.launch(appName)
  registerAll = apps => appManager.registerAll(apps)
  registerValue = (key, value) => Storage.setItem(key, value)
  configContainer = container => router.configContainer(container)
  currentAppName = () => CURRENT_APP_NAME

  init = ({
    apps = [],
    modules = [],
    container,
    maxAppNum,
    methods = {},
    values = {},
    // expiredTime = EXPIRED_TIME,
  } = {}) => {
    if (this.initialed) {
      return
    }
    this.initialed = true

    Object.keys(methods).forEach(key => this.registerMethod(key, methods[key]))
    Object.keys(values).forEach(key => this.registerValue(key, values[key]))
    router.configContainer(container)
    appManager.configMaxAppNum(maxAppNum)
    appManager.registerAll(apps)
    moduleManager.useAll(modules)
  }

  registerMethod = (methodName, method) => {
    checkTypeString(methodName)

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

  onLaunchApp = callback => mom.on(OsStateModifyEvent.APP_CHANGE, callback)
}

export default new Os()

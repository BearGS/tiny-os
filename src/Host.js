/* eslint-disable no-param-reassign */
import appManager from './AppManager'
import router from './Router'

const _modules = {}

export default class Host {
  constructor () {
    if (typeof Host.instance === 'object'
      && Host.instance instanceof Host) {
      return Host.instance
    }
    Object.defineProperty(Host, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })
  }

  launchApp = app => appManager.launch(app)
  registerApp = app => appManager.register(app)
  registerAll = apps => appManager.registerAll(apps)
  configContainer = container => router.configContainer(container)
  getApps = () => appManager.getApps()

  use = (module, ...options) => {
    if (module.installed) {
      return
    }
    module.install(this.modules, options)
    module.installed = true
    
    return this // eslint-disable-line
  }

  getModules = () => _modules
  getModule = module => _modules[module]
}
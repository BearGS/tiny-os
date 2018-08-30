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

  configContainer (container) {
    router.configContainer(container)
  }

  registerApp (app) {
    appManager.register(app)
  }

  registerAll (apps) {
    appManager.registerAll(apps)
  }

  launchApp (app) {
    appManager.launch(app)
  }

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
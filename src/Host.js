/* eslint-disable no-param-reassign */
import AppManager from './AppManager'

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

    this.appManager = new AppManager()
  }

  registerApp (app) {
    this.appManager.register(app)
  }

  launchApp (app) {
    this.appManager.launch(app)
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
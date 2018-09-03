/* eslint-disable no-param-reassign */
import App, { _apps } from './App'
import router from './Router'
import invariant from './utils/invariant'
import sortAppByLRU from './utils/sortAppByLRU'
import { MAX_APP, OsHandler } from './constants'

class AppManager {
  constructor () {
    if (typeof AppManager.instance === 'object'
      && AppManager.instance instanceof AppManager) {
      return AppManager.instance
    }
    Object.defineProperty(AppManager, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })

    router.listen(this.onOuterAppChange.bind(this))
  }

  register = ({
    name,
    url,
    priority,
  } = {}) => {
    invariant(
      !name || typeof name !== 'string',
      'Invalid params name',
    )

    invariant(
      !url || typeof url !== 'string',
      'Invalid params url',
    )

    invariant(
      this.getApp(name, true),
      `you've already register another app named \`${name}\``,
    )

    const registeringApp = new App({ name, url, priority })
    _apps.unshift(registeringApp)

    const appName = router.history.location.hash.slice(1)
    if (appName) {
      const app = this.getApp(appName, true)

      if (app) {
        this.launch(app.name)
      }
    }
  }

  registerAll = apps => apps.forEach(app => this.register(app))

  // outer hash change, for example, directly click a Tag with hash
  onOuterAppChange = ({ hash = '' }) => {
    if (!hash) return

    const appName = hash.slice(1)
    const app = this.getApp(appName, true)

    if (!app) {
      this.suspendOpendApp()
    } else {
      this.launch(app.name)
    }
  }

  launch = appName => {
    const app = this.getApp(appName)
    this
      .suspendOpendApp()
      .load(app)
      .open(app)
      .killOverflowApp()
  }

  load = loadingApp => {
    loadingApp.toBackend()
    _apps.sort(sortAppByLRU)
    router.updateRouter({ ...loadingApp, handler: OsHandler.LOAD })

    return this
  }

  open = openingApp => {
    openingApp.toFrontend()
    router.updateRouter({ ...openingApp, handler: OsHandler.OPEN })

    return this
  }

  suspend = suspendingApp => {
    suspendingApp.toBackend()
    router.updateRouter({ ...suspendingApp, handler: OsHandler.SUSPEND })

    return this
  }

  kill = killingApp => {
    killingApp.toUnload()
    router.updateRouter({ ...killingApp, handler: OsHandler.KILL })

    return this
  }

  suspendOpendApp = () => {
    _apps
      .filter(app => app.isFrontendApp)
      .forEach(app => this.suspend(app))

    return this
  }

  killOverflowApp = () => {
    const backendApp = _apps
      .filter(app => app.isBackendApp)

    if (backendApp.length >= MAX_APP) {
      const killingApp = backendApp.pop()
      this.kill(killingApp)
    }

    return this
  }

  getApps = () => _apps
  getApp = (appName, flag) => {
    const App2 = _apps.find(app => app.name === appName)

    invariant(
      !flag && !App2,
      `No such App named \`${appName}\``,
    )

    return App2
  }
  getUnloadApps = () => _apps.filter(app => app.isUnloadApp)
  getBackendApps = () => _apps.filter(app => app.isBackendApp)
  getFrontendApps = () => _apps.filter(app => app.isFrontendApp)
}

export default new AppManager()


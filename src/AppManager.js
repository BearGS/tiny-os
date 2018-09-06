/* eslint-disable no-param-reassign */
import router from './Router'
import App, { _apps } from './App'
import invariant from './utils/invariant'
import sortAppByLRU from './utils/sortAppByLRU'
import { OsHandler, MAX_APP } from './constants'

class AppManager {
  constructor () {
    this.maxAppNum = MAX_APP
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
      this.getApp(name),
      `you've already register another app named \`${name}\``,
    )

    const registeringApp = new App({ name, url, priority })
    _apps.unshift(registeringApp)

    const appName = window.location.hash.slice(1)
    if (appName) {
      const app = this.getApp(appName)

      if (app) {
        this.launch(app.name)
      }
    }
  }

  registerAll = apps => apps.forEach(app => this.register(app))

  // outer hash change. for example: click a link with hash
  onOuterAppChange = ({ hash: appName = '' }) => {
    if (!appName) return

    const app = this.getApp(appName)

    if (!app) {
      this.suspendOpendApp()
    } else {
      this.launch(app.name)
    }
  }

  launch = appName => {
    const launchingApp = this.getApp(appName)
    invariant(!launchingApp, `No such App named \`${appName}\``)

    this
      .suspendOpendApp()
      .load(launchingApp)
      .open(launchingApp)
      .killOverflowApp()
  }

  load = loadingApp => {
    loadingApp.toBackend()
    _apps.sort(sortAppByLRU)
    router.render({ ...loadingApp, handler: OsHandler.LOAD })

    return this
  }

  open = openingApp => {
    openingApp.toFrontend()
    router.render({ ...openingApp, handler: OsHandler.OPEN })

    return this
  }

  suspend = suspendingApp => {
    suspendingApp.toBackend()
    router.render({ ...suspendingApp, handler: OsHandler.SUSPEND })

    return this
  }

  kill = killingApp => {
    killingApp.toUnload()
    router.render({ ...killingApp, handler: OsHandler.KILL })

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

    if (backendApp.length >= this.maxAppNum) {
      const killingApp = backendApp.pop()
      this.kill(killingApp)
    }

    return this
  }

  killExpiredApp = () => {} // kill超时backend APP

  configMaxAppNum = (num = MAX_APP) => {
    this.maxAppNum = num
  }

  getApps = () => _apps
  getApp = appName => _apps.find(app => app.name === appName)
  getUnloadApps = () => _apps.filter(app => app.isUnloadApp)
  getLoadedApps = () => _apps.filter(app => !app.isUnloadApp)
  getBackendApps = () => _apps.filter(app => app.isBackendApp)
  getFrontendApps = () => _apps.filter(app => app.isFrontendApp)
}

export default new AppManager()


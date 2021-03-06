/* eslint-disable no-param-reassign */
import mom from './MomOS'
import router from './Router'
import App, { _apps } from './App'
import { EventPacket } from './packet'
import invariant from './utils/invariant'
import sortAppByLRU from './utils/sortAppByLRU'
import requiredParam from './utils/requiredParam'
import { checkTypeString } from './utils/checkType'
import { OsHandler, MAX_APP, HandleAppEvent, OsStateModifyEvent } from './constants'

class AppManager {
  constructor () {
    this.maxAppNum = MAX_APP
  }

  register = ({
    name = requiredParam('name'),
    url = requiredParam('url'),
    priority,
  } = {}) => {
    checkTypeString(name)
    checkTypeString(url)

    invariant(
      name === '',
      'param `name` must not be empty string'
    )

    invariant(
      url === '',
      'param `url` must not be empty string'
    )

    invariant(
      this.getApp(name),
      `you've already register another app named \`${name}\``,
    )

    const registeringApp = new App({ name, url, priority })
    _apps.unshift(registeringApp)
  }

  registerAll = apps => {
    apps.forEach(app => this.register(app))

    const appName = window.location.hash.slice(1)
    if (appName) {
      const app = this.getApp(appName)

      if (app) {
        this.launch(app.name)
      }
    }
  }

  launch = appName => {
    const alreadyLaunched = this
      .getFrontendApps()
      .find(fApp => fApp.name === appName)

    if (alreadyLaunched) {
      return
    }

    const launchingApp = this.getApp(appName)
    invariant(!launchingApp, `No such App named \`${appName}\``)

    this
      .suspendOpendApp()
      .load(launchingApp)
      .open(launchingApp)
      .killOverflowApp()

    mom.sendToApp(
      launchingApp,
      new EventPacket({
        eventName: HandleAppEvent.LAUNCH_APP,
        payload: { appName: launchingApp.name },
      })
    )
    mom.emit(
      OsStateModifyEvent.APP_CHANGE,
      { appName: launchingApp.name },
    )
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

    mom.sendToApp(
      suspendingApp,
      new EventPacket({
        eventName: HandleAppEvent.SUSPEND_APP,
        payload: { appName: suspendingApp.name },
      })
    )

    return this
  }

  kill = killingApp => {
    killingApp.toUnload()
    router.render({ ...killingApp, handler: OsHandler.KILL })

    return this
  }

  suspendOpendApp = () => {
    this
      .getFrontendApps()
      .forEach(app => this.suspend(app))

    return this
  }

  killOverflowApp = () => {
    const backendApp = this.getBackendApps()

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
  getSecureOrigins = () => _apps.map(app => app.origin)
  getApp = appName => _apps.find(app => app.name === appName)
  hasApp = appName => _apps.some(app => app.name === appName)
  getUnloadApps = () => _apps.filter(app => app.isUnloadApp)
  getLoadedApps = () => _apps.filter(app => !app.isUnloadApp)
  getBackendApps = () => _apps.filter(app => app.isBackendApp)
  getFrontendApps = () => _apps.filter(app => app.isFrontendApp)
}

export default new AppManager()


/* eslint-disable no-param-reassign */
// import mom from './MomOS'
import router from './Router'
import App, { _apps } from './App'
import invariant from './utils/invariant'
import sortAppByLRU from './utils/sortAppByLRU'
import { OsHandler, MAX_APP, BroadcastEvent } from './constants'
import requiredParam from './utils/requiredParam'
import { checkTypeString } from './utils/checkType'
import { EventPacket } from './packet'

let mom = {
  sendToApp () {}
}

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

    const appName = window.location.hash.slice(1)
    if (appName) {
      const app = this.getApp(appName)

      if (app) {
        this.launch(app.name)
      }
    }
  }

  registerAll = apps => apps.forEach(app => this.register(app))

  launch = appName => {
    const a = window.location.host
    console.log(a)
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

    // mom.broadcast({
    //   eventName: BroadcastEvent.LAUNCH_APP,
    //   payload: { appName },
    // })

    mom.sendToApp(
      launchingApp,
      new EventPacket({
        eventName: BroadcastEvent.LAUNCH_APP,
        payload: { appName: launchingApp.name },
      })
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
        eventName: BroadcastEvent.SUSPEND_APP,
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
  hasApp = appName => _apps.some(app => app.name === appName)
  getUnloadApps = () => _apps.filter(app => app.isUnloadApp)
  getLoadedApps = () => _apps.filter(app => !app.isUnloadApp)
  getBackendApps = () => _apps.filter(app => app.isBackendApp)
  getFrontendApps = () => _apps.filter(app => app.isFrontendApp)

  configMom = momOs => {
    mom = momOs
  }
}

export default new AppManager()


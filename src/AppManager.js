/* eslint-disable no-param-reassign */
import router from './Router'
import invariant from './utils/invariant'
import sortAppByLRU from './utils/sortAppByLRU'
import { AppState, MAX_APP, AppPriority, OsHandler } from './constants'

const _apps = []

function setBackend (app) {
  app.state = AppState.BACKEND
  app.loadTime = Date.now()
}
function setFrontend (app) {
  app.state = AppState.FRONTEND
}
function setUnload (app) {
  app.state = AppState.UNLOAD
  app.loadTime = 0
}
function updateRouter (app) {
  router.updateRouterMap(_apps)
  if (app) {
    router.render(app)
    if (app.handler === OsHandler.OPEN) {
      router.goRouter(app)
    }
  }
}

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

    router.history.listen(this.onOuterAppChange.bind(this))
  }

  register = ({
    name,
    url,
    priority = AppPriority.TEMPORARY
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

    const registeringApp = { name, url, priority }
    _apps.unshift(registeringApp)
    setUnload(registeringApp)
    updateRouter()
  }

  registerAll = apps => {
    apps.forEach(app => this.register(app))
  }

  // outer hash change, for example, directly click a Tag with hash
  onOuterAppChange = ({ hash = '' }) => {
    if (!hash) return
    const appName = hash.slice(1)
    const app = this.getApp(appName, true)
    if (app) {
      this.launch(app.name)
    } else {
      window.location.hash = hash
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
    setBackend(loadingApp)
    _apps.sort(sortAppByLRU)
    updateRouter({ ...loadingApp, handler: OsHandler.LOAD })

    return this
  }

  open = openingApp => {
    setFrontend(openingApp)
    updateRouter({ ...openingApp, handler: OsHandler.OPEN })

    return this
  }

  suspend = suspendingApp => {
    setBackend(suspendingApp)
    updateRouter({ ...suspendingApp, handler: OsHandler.SUSPEND })

    return this
  }

  kill = killingApp => {
    setUnload(killingApp)
    updateRouter({ ...killingApp, handler: OsHandler.KILL })

    return this
  }

  suspendOpendApp = () => {
    _apps
      .filter(app => app.state === AppState.FRONTEND)
      .forEach(app => this.suspend(app))

    return this
  }

  killOverflowApp = () => {
    const backendApp = _apps
      .filter(app => app.state === AppState.BACKEND)
    if (backendApp.length >= MAX_APP) {
      const killedApp = backendApp.pop()
      this.kill(killedApp)
    }

    return this
  }

  getApps = () => _apps
  getApp = (appName, flag) => {
    const App = _apps.find(app => app.name === appName)

    invariant(
      !flag && !App,
      `No such App named \`${appName}\``,
    )

    return App
  }
  getUnloadApps = () => _apps.filter(app => app.state === AppState.UNLOAD)
  getBackendApps = () => _apps.filter(app => app.state === AppState.BACKEND)
  getFrontendApps = () => _apps.filter(app => app.state === AppState.FRONTEND)
}

export default new AppManager()


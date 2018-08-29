/* eslint-disable no-param-reassign */
// import Router from './Router'
import invariant from './utils/invariant'
import sortAppByLRU from './utils/sortAppByLRU'
import { AppState, MAX_APP, AppPriority } from './constants'

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

export default class AppManager {
  _apps = []

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

    // this.router = new Router()
  }

  launch = appName => {
    invariant(
      !this.getApp(appName),
      `No such App named \`${appName}\``,
    )

    this
      .suspendOpendApp()
      .load(appName)
      .open(appName)
      .killOverflowApp()
  }

  register = ({ 
    name, 
    url, 
    priority = AppPriority.TEMPORARY 
  } = {}) => {
    invariant(
      !name || typeof name !== 'string',
      `Invalid params name`,
    )

    invariant(
      !url || typeof url !== 'string',
      `Invalid params url`,
    )    
    
    invariant(
      this.getApp(name),
      `you've already register another app named \`${name}\``,
    )

    const registeringApp = { name, url, priority }
    this._apps.unshift(registeringApp)
    setUnload(registeringApp)

    return this
  }

  registerAll = apps => apps.forEach(app => this.register(app))

  load = appName => {
    const loadingApp = this.getApp(appName)
    setBackend(loadingApp)
    this.sortApp()

    return this
  }

  open = appName => {
    const openingApp = this.getApp(appName)
    setFrontend(openingApp)

    return this
  }

  suspend = appName => {
    const suspendingApp = this.getApp(appName)
    setBackend(suspendingApp)

    return this
  }

  kill = appName => {
    const killingApp = this.getApp(appName)
    setUnload(killingApp)

    return this
  }

  suspendOpendApp = () => {
    this._apps
      .filter(app => app.state === AppState.FRONTEND)
      .forEach(app => this.suspend(app.name))

    return this
  }

  killOverflowApp = () => {
    const backendApp = this._apps
      .filter(app => app.state === AppState.BACKEND)

    if (backendApp.length >= MAX_APP) {
      const killedApp = backendApp.pop()
      setUnload(killedApp)
    }

    return this
  }

  sortApp () {
    this._apps.sort(sortAppByLRU)
  }

  getApp = name => this._apps.find(app => app.name === name)
  getApps = () => this._apps

  getBackendApps = () => this._apps.filter(app => app.state === AppState.BACKEND)
  getFrontendApps = () => this._apps.filter(app => app.state === AppState.FRONTEND)
  getUnloadApps = () => this._apps.filter(app => app.state === AppState.UNLOAD)
}
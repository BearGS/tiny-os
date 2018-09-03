import { AppState, AppPriority } from './constants'

export const _apps = []

export default class App {
  constructor ({ name, url, priority }) {
    this.name = name
    this.url = url
    this.priority = priority || AppPriority.TEMPORARY
    this.state = AppState.UNLOAD
    this.loadTime = 0
    this.isWhatApp()
  }

  toUnload = () => {
    this.state = AppState.UNLOAD
    this.loadTime = 0
    this.isWhatApp()
  }

  toBackend = () => {
    this.state = AppState.BACKEND
    this.loadTime = Date.now()
    this.isWhatApp()
  }

  toFrontend = () => {
    this.state = AppState.FRONTEND
    this.isWhatApp()
  }

  isWhatApp = () => {
    this.isUnloadApp = this.state === AppState.UNLOAD
    this.isBackendApp = this.state === AppState.BACKEND
    this.isFrontendApp = this.state === AppState.FRONTEND
  }
}

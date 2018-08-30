import { OsHandler } from './constants'
import createHistoryFactory from './utils/createHistoryFactory'
import { createIframe, removeIframe, hideIframe, showIframe } from './utils/iframe'

let currentUrl = ''
let routerMap = []
let iframeMap = []

class Router {
  container = window.document.body

  constructor (initUrl) {
    currentUrl = initUrl || window.location.hash || '' 
    this.history = createHistoryFactory(window.history)
    this.unlisten = this.history.listen(this.render.bind(this))
    this.history.setHash(currentUrl)
  }

  updateRouterMap = appMap => {
    routerMap = appMap
  }

  configContainer = container => {
    if (typeof container === 'string') {
      this.container = document.getElementById(container)
    } else {
      this.container = container
    }
  }

  goRouter ({ name, handler }) {
    this.history.setHash({
      hash: name,
      handler,
    })
  }

  loadIframe ({ name, url }) {
    const iframe = createIframe(this.container, name, url)
    iframeMap.push({
      name,
      iframe,
    })
  }

  killIframe ({ name }) {
    removeIframe(this.container, name)
    iframeMap = iframeMap.filter(item => item.name !== name)
  }

  render = ({ hash, handler }) => {
    const app = routerMap.find(router => router.name === hash.slice(1))

    switch (handler) {
      case OsHandler.LOAD:
        this.loadIframe(app)
        break
      case OsHandler.OPEN:
        showIframe(iframeMap.find(item => item.name === app.name).iframe)
        break
      case OsHandler.SUSPEND:
        hideIframe(iframeMap.find(item => item.name === app.name).iframe)
        break
      case OsHandler.KILL:
        this.killIframe(app)
        break
      default:
        break
    }
  }

  getCurrentUrl = () => currentUrl
  getRouterMap = () => routerMap
}

export default new Router()
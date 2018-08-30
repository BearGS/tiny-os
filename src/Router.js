import { OsHandler } from './constants'
import invariant from './utils/invariant'
import createHistoryFactory from './utils/createHistoryFactory'
import { createIframe, removeIframe, hideIframe, showIframe } from './utils/iframe'

let currentUrl = ''
let routerMap = []
let iframeMap = []

function getIframe (app) {
  const iframeApp = iframeMap.find(item => item.name === app.name)

  invariant(
    !iframeApp,
    `No such Iframe named \`${app.name}\``,
  )

  return iframeApp.iframe
}

function getRouter (name) {
  const app = routerMap.find(router => router.name === name)

  invariant(
    !app,
    `No such router named \`${name}\``,
  )

  return app
}

class Router {
  container = window.document.body

  constructor (initUrl) {
    currentUrl = initUrl || window.location.hash || ''
    this.history = createHistoryFactory(window.history)
    // this.unlisten = this.history.listen(this.render.bind(this))
    // currentUrl && this.goRouter({ name: currentUrl }) // eslint-disable-line
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

  goRouter = ({ name, handler }) => this.history.setHash({ hash: name, handler })
  // goRouter = ({ name, handler }) => this.render({ hash: name, handler })
  render = ({ name = '', handler }) => {
    const app = getRouter(name)
    switch (handler) {
      case OsHandler.LOAD:
        this.loadIframe(app)
        break
      case OsHandler.OPEN:
        showIframe(getIframe(app))
        break
      case OsHandler.SUSPEND:
        hideIframe(getIframe(app))
        break
      case OsHandler.KILL:
        this.killIframe(app)
        break
      default:
        break
    }
  }

  loadIframe = ({ name, url }) => {
    if (!iframeMap.find(iframe => iframe.name === name)) {
      const iframe = createIframe(this.container, name, url)
      iframeMap.push({ name, iframe })
    }
  }

  killIframe = ({ name }) => {
    removeIframe(this.container, name)
    iframeMap = iframeMap.filter(item => item.name !== name)
  }

  getCurrentUrl = () => currentUrl
  getRouterMap = () => routerMap
}

export default new Router()

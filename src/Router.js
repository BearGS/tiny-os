import { OsHandler } from './constants'
import { _apps as routerMap } from './App'
import invariant from './utils/invariant'
import createHistoryFactory from './utils/createHistoryFactory'
import { createIframe, removeIframe, hideIframe, showIframe } from './utils/iframe'

let currentUrl = ''


function getApp (name) {
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
  }

  listen = fn => this.history.listen(fn)

  configContainer = container => {
    if (typeof container === 'string') {
      this.container = document.getElementById(container)
    } else {
      this.container = container
    }
  }

  updateRouter = ({ name, handler }) => {
    this.render({ name, handler })

    if (handler === OsHandler.OPEN) {
      this.history.setHash({ hash: name, handler })
    }
  }

  render = ({ name = '', handler } = {}) => {
    const app = getApp(name)

    switch (handler) {
      case OsHandler.LOAD:
        this.loadIframe(app)
        break
      case OsHandler.OPEN:
        showIframe(app.iframe)
        break
      case OsHandler.SUSPEND:
        hideIframe(app.iframe)
        break
      case OsHandler.KILL:
        this.killIframe(app)
        break
      default:
        break
    }
  }

  loadIframe = app => {
    if (!app.iframe) {
      const iframe = createIframe(this.container, app.name, app.url)
      app.iframe = iframe // eslint-disable-line
    }
  }

  killIframe = app => {
    removeIframe(this.container, app.name)
    app.iframe = null // eslint-disable-line
  }

  getCurrentUrl = () => currentUrl
  getRouterMap = () => routerMap
}

export default new Router()

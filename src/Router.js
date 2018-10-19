import Storage from './utils/storage'
import { OsHandler } from './constants'
import invariant from './utils/invariant'
import { _apps as routerMap } from './App'
import createHistoryFactory from './utils/createHistoryFactory'
import { createIframe, removeIframe, hideIframe, showIframe } from './utils/iframe'

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

  constructor () {
    this.history = createHistoryFactory(window.history)
  }

  listen = fn => this.history.listen(fn)

  render = ({ name = '', handler } = {}) => {
    const app = getApp(name)

    switch (handler) {
      case OsHandler.LOAD:
        this.loadIframe(app)
        break
      case OsHandler.OPEN:
        showIframe(app.iframe)
        this.history.setHash({ hash: name })
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
      const result = app.url.match(/:[a-zA-Z]\w*/g) || []
      const params = result.map(item => item.slice(1))

      const value = params.map(item => Storage.getItem(item))

      const url = result.reduce(
        (res, item, index) => res.replace(item, value[index]),
        app.url
      )

      const iframe = createIframe(this.container, app.name, url)
      app.iframe = iframe // eslint-disable-line
    }
  }

  killIframe = app => {
    removeIframe(this.container, app.name)
    app.iframe = null // eslint-disable-line
  }

  configContainer = container => {
    if (!container) {
      return
    }
    if (typeof container === 'string') {
      this.container = document.getElementById(container)
    } else {
      this.container = container
    }
  }
}

export default new Router()

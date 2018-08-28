import createHistoryFactory from './utils/createHistoryFactory'
import { OsHandler } from './constants'

export default class Router {
  constructor (url) {
    this.url = url || window.location.hash 
    this.history = createHistoryFactory(window.history)
    this.init()
  }

  init = () => {
    this.unlisten = this.history.listen(this.render.bind(this))
    this.history.setHash(this.url)
  }

  render = ({ hash, handler }) => {
    this.url = hash

    switch (handler) {
      case OsHandler.LOAD:
        this.do()
        break
      case OsHandler.OPEN:
        this.do()
        break
      case OsHandler.SUSPEND:
        this.do()
        break
      case OsHandler.KILL:
        this.do() // 
        break
      default:
        this.do() // directly change hash, create new iframe
    }
  }
}
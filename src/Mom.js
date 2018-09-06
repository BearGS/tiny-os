import {
  TOS_REQUEST_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
// import appManager from './AppManager'
// import moduleManager from './ModuleManager'

// const invokeMap = new Map()

// function delOneInvoke(id) {
//   return invokeMap.delete(id)
// }

// function addOneInvoke(id, promise) {
//   return invokeMap.set(id, promise)
// }

// function getOneInvoke(id) {
//   return invokeMap.get(id)
// }

/**
 * Message-Oriented Middleware
 */
class Mom {
  constructor () {
    window.addEventListener('message', this.onMessage.bind(this))
  }

  response = () => {}

  // invoke = packet => {
  // const { service } = packet
  // const module = moduleManager.getModule(service)
  // const app = appManager.getApp(service)
  // }

  onMessage = event => {
    const message = event.data

    switch (message.type) {
      case TOS_REQUEST_PACKET_TYPE:
      case TOS_RESPONSE_PACKET_TYPE:
        break
      case TOS_EVENT_PACKET_TYPE:
        break
      default:
    }
  }
}

export default new Mom()


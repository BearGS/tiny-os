/**
 * Message-Oriented Middleware
 */
// import appManager from './AppManager'
// import { _modules } from './Module'
import {
  TOS_REQUEST_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'

class Mom {
  constructor () {
    window.addEventListener('message', this.onMessage.bind(this))
  }

  response = () => {}

  // invoke = packet => {
  //   const { service } = packet

  //   if (appManager.getApp(service)) {}
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


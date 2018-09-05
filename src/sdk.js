import os from './os'
import mom from './Mom'
import { EventPacket, InvokePacket } from './packet'
import { sendToParentIframe } from './utils/communication'

export default class Sdk {
  constructor () {
    if (!this.isInIframe()) {
      return os
    }

    if (typeof Sdk.instance === 'object'
      && Sdk.instance instanceof Sdk) {
      return Sdk.instance
    }
    Object.defineProperty(Sdk, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })
  }

  isInIframe = () => window.parent !== window
  broadcast = message => sendToParentIframe(new EventPacket(message))
  invoke = invokePacket => mom.invoke(new InvokePacket(invokePacket))

  onRegister = () => {}
  onLoad = () => {}
  onUnload = () => {}
  onOpen = () => {}
  onUnopen = () => {}
  onSuspend = () => {}
  onKill = () => {}
  onMessage = () => {}
}

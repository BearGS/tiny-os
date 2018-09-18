import Os from './os'
import MomSDK from './MomSDK'
import { Role } from './constants'
import { EventPacket } from './packet'
import { sendToParentIframe } from './utils/communication'

let mom

export default class Sdk {
  constructor (name) {
    if (!this.isInIframe()) {
      return new Os()
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

    mom = new MomSDK(name)
  }

  registerMethod = (methodName, method) => {
    mom.on(methodName, async packet => {
      const { payload } = packet
      try {
        const result = await method(payload)
        mom.response({ ...packet, payload: { result } })
      } catch (e) {
        mom.response({
          ...packet,
          payload: {
            error: true,
            errorMessage: e.message,
          }
        })
      }
    })
  }

  isInIframe = () => window.parent !== window
  broadcast = message => sendToParentIframe(new EventPacket(message))
  invoke = packet => mom.invoke({ service: Role.OS, ...packet })

  onRegister = () => {}
  onLoad = () => {}
  onUnload = () => {}
  onOpen = () => {}
  onUnopen = () => {}
  onSuspend = () => {}
  onKill = () => {}
  on = (eventName, callback) => mom.on(eventName, callback)
}

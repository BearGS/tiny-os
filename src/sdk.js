import Os from './os'
import MomSDK from './MomSDK'
import { Role, BroadcastEvent } from './constants'
import { EventPacket } from './packet'
import { sendToParentIframe } from './utils/communication'

let mom

export default class Sdk {
  constructor (serviceName) {
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

    mom = new MomSDK(serviceName)
  }

  registerMethod = (methodName, method) => {
    mom.on(methodName, async packet => {
      const { payload } = packet
      try {
        const result = await method(payload)
        mom.handleResponse({ ...packet, payload: { result } })
      } catch (e) {
        mom.handleresponse({
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

  onLoadApp = callback => mom.on(BroadcastEvent.LOAD_APP, callback)
  onOpenApp = callback => mom.on(BroadcastEvent.OPEN_APP, callback)
  onSuspendApp = callback => mom.on(BroadcastEvent.SUSPEND_APP, callback)
  onKillApp = callback => mom.on(BroadcastEvent.KILL_APP, callback)
  onLaunchApp = callback => mom.on(BroadcastEvent.LAUNCH_APP, callback)
  on = (eventName, callback) => mom.on(eventName, callback)
}

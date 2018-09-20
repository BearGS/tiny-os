// import Os from './os'
import MomSDK from './MomSDK'
import { Role, BroadcastEvent } from './constants'
import { EventPacket } from './packet'

let mom

export default class Sdk {
  constructor (serviceName) {
    // if (window.parent === window) {
    //   return new Os()
    // }

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
      const { id, payload } = packet
      try {
        const result = await method(payload)
        mom.handleResponse({ id, result })
      } catch (e) {
        mom.handleResponse({
          id,
          result: {
            error: true,
            errorMessage: e.message,
          }
        })
      }
    })
  }

  invoke = packet => mom.invoke({ service: Role.OS, ...packet })

  launchApp = appName =>
    mom.sendToOs(new EventPacket({
      eventName: BroadcastEvent.LAUNCH_APP,
      payload: { appName }
    }))

  onLoadApp = callback => mom.on(BroadcastEvent.LOAD_APP, callback)
  onOpenApp = callback => mom.on(BroadcastEvent.OPEN_APP, callback)
  onSuspendApp = callback => mom.on(BroadcastEvent.SUSPEND_APP, callback)
  onKillApp = callback => mom.on(BroadcastEvent.KILL_APP, callback)
  onLaunchApp = callback => mom.on(BroadcastEvent.LAUNCH_APP, callback)
  // on = (eventName, callback) => mom.on(eventName, callback)
}

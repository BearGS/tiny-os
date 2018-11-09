import Kernel from './Kernel'
import MomSDK from './MomSDK'
import { EventPacket } from './packet'
import { Role, BroadcastEvent } from './constants'
import { checkTypeString } from './utils/checkType'

let mom

export default class Sdk extends Kernel {
  constructor (serviceName) {
    super()

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

  invoke = packet => mom.invoke({ service: Role.OS, ...packet })
  onLoadApp = callback => mom.on(BroadcastEvent.LOAD_APP, callback)
  onOpenApp = callback => mom.on(BroadcastEvent.OPEN_APP, callback)
  onSuspendApp = callback => mom.on(BroadcastEvent.SUSPEND_APP, callback)
  onKillApp = callback => mom.on(BroadcastEvent.KILL_APP, callback)
  onLaunchApp = callback => mom.on(BroadcastEvent.LAUNCH_APP, callback)
  launchApp = appName =>
    mom.sendToOs(new EventPacket({
      eventName: BroadcastEvent.LAUNCH_APP,
      payload: { appName }
    }))
  registerMethod = (methodName, method) => {
    checkTypeString(methodName)

    mom.on(methodName, async packet => {
      const { id, payload } = packet
      let result

      try {
        if (typeof method === 'function') {
          result = await method(payload)
        } else {
          result = await method
        }
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
  // on = (eventName, callback) => mom.on(eventName, callback)
}

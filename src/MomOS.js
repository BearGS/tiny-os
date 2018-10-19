import Mom from './Mom'
import { Role, PacketType } from './constants'
import appManager from './AppManager'
import invokeMap from './utils/invokeMap'
import invariant from './utils/invariant'
import moduleManager from './ModuleManager'
import { sendToChildIframe } from './utils/communication'
import { InvokePacket, ResponsePacket, EventPacket } from './packet'

/**
 * Message-Oriented Middleware
 */
export default class MomOS extends Mom {
  constructor () {
    super()

    if (typeof MomOS.instance === 'object'
      && MomOS.instance instanceof MomOS) {
      return MomOS.instance
    }

    Object.defineProperty(MomOS, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })
    window.addEventListener('message', this.onMessage.bind(this))
  }

  invoke = packet => {
    const invokePacket = new InvokePacket({
      ...packet,
      originType: Role.OS,
      origin: Role.OS,
    })
    const promise = this.genPromise(invokePacket)
    invokeMap.setItem({ ...invokePacket, promise })

    this.dispatchInvoke(invokePacket)

    return promise
  }

  onInvoke = packet => {
    const promise = this.genPromise(packet)
    invokeMap.setItem({ ...packet, promise })

    this.dispatchInvoke({
      ...packet,
      origin: Role.OS,
      originType: Role.OS,
    })

    return promise
  }

  dispatchInvoke = packet => {
    const { service, method } = packet
    const module = moduleManager.getModule(service)
    const app = appManager.getApp(service)
    const isOS = service === Role.OS

    if (module) {
      /* */
    } else if (isOS) {
      this.sendToSelf(method, packet)
    } else if (app) {
      this.sendToApp(app, packet)
    }
  }

  broadcast = message => {
    const eventPacket = new EventPacket(message)

    appManager
      .getLoadedApps()
      .forEach(app => this.sendToApp(app, eventPacket))
  }

  sendToApp = (app, packet) => {
    invariant(
      app.isUnloadApp,
      'App is unLoad, can\'t send message ',
    )

    sendToChildIframe(app.iframe, packet)
  }
  sendToModule = (module, packet) => {}

  onMessage = async event => {
    const packet = event.data
    const {
      id,
      type,
      eventName,
      origin,
      originType,
    } = packet

    const apps = appManager.getApps()
    const secureOrigins = apps.map(app => app.origin)

    if (!secureOrigins.includes(event.origin)) {
      return
    }

    switch (type) {
      case PacketType.TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.onInvoke(packet)
          const targetApp = appManager.getApp(origin)
          this.sendToApp(
            targetApp,
            new ResponsePacket({
              ...packet,
              origin: Role.OS,
              originType: Role.OS,
              service: origin,
              payload: { result },
            }),
          )
        } catch (e) { /* do nothing */ }
        break

      case PacketType.TOS_RESPONSE_PACKET_TYPE:
        if (originType !== Role.APP && originType !== Role.MODULE) {
          return
        }
        this.handleResponse({ id, result: packet.payload.result })
        break

      case PacketType.TOS_EVENT_PACKET_TYPE:
        this.emit(eventName, packet)
        break

      default:
        /* do nothing */
    }
  }
}


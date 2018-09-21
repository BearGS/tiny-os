import Mom from './Mom'
import { Role, PacketType } from './constants'
import invokeMap from './utils/invokeMap'
import { InvokePacket, ResponsePacket } from './packet'
import { sendToParentIframe } from './utils/communication'

/**
 * Message-Oriented Middleware
 */
export default class MomSDK extends Mom {
  constructor (service) {
    super()

    if (typeof MomSDK.instance === 'object'
      && MomSDK.instance instanceof MomSDK) {
      return MomSDK.instance
    }

    Object.defineProperty(MomSDK, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })

    this.service = service
    window.addEventListener('message', this.onMessage.bind(this))
  }

  sendToOs = packet => sendToParentIframe(packet)

  invoke = packet => {
    const { service, method } = packet
    const invokePacket = new InvokePacket({
      ...packet,
      origin: this.service,
      originType: Role.APP,
    })
    const promise = this.genPromise(invokePacket)

    invokeMap.setItem({ ...invokePacket, promise })

    if (service === this.service) {
      this.sendToSelf(method, invokePacket)
    } else {
      this.sendToOs(invokePacket)
    }

    return promise
  }

  onInvoke = packet => {
    const { method } = packet
    const promise = this.genPromise(packet)

    invokeMap.setItem({ ...packet, promise })
    this.sendToSelf(method, packet)

    return promise
  }

  onMessage = async event => {
    const packet = event.data
    const {
      id,
      type,
      eventName,
      payload,
    } = packet

    switch (type) {
      case PacketType.TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.onInvoke(packet)
          this.sendToOs(new ResponsePacket({ ...packet, payload: { result } }))
        } catch (e) { /* do nothing */ }
        break

      case PacketType.TOS_RESPONSE_PACKET_TYPE:
        this.handleResponse({ id, result: packet.payload.result })
        break

      case PacketType.TOS_EVENT_PACKET_TYPE:
        this.emit(eventName, payload)
        break

      default:
        /* do nothing */
    }
  }
}


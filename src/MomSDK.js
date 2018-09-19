import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
import invokeMap from './utils/invokeMap'
import EventEmitter from './utils/EventEmitter'
import { INVOKE_TIMEOUT, Role } from './constants'
import { InvokePacket, ResponsePacket } from './packet'
import { sendToParentIframe } from './utils/communication'

/**
 * Message-Oriented Middleware
 */
export default class MomSDK extends EventEmitter {
  constructor (service) {
    super()
    window.addEventListener('message', this.onMessage.bind(this))
    this.service = service
  }

  sendToOs = packet => sendToParentIframe(packet)
  sendToSelf = (method, packet) => this.emit(method, packet)

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

  handleResponse = packet => {
    const { id, payload: { result } } = packet
    const invokePacket = invokeMap.deleteItem(id)
    invokePacket.promise.resolve(result)
  }

  onMessage = async event => {
    const packet = event.data
    const { type, eventName, payload } = packet

    switch (type) {
      case TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.onInvoke(packet)
          this.sendToOs(new ResponsePacket({ ...packet, payload: { result } }))
        } catch (e) { /* do nothing */ }
        break

      case TOS_RESPONSE_PACKET_TYPE:
        this.handleResponse(packet)
        break

      case TOS_EVENT_PACKET_TYPE:
        this.emit(eventName, payload)
        break

      default:
        /* do nothing */
    }
  }

  genPromise = packet => {
    let _resolve
    let _reject

    const { id, timeout = INVOKE_TIMEOUT } = packet
    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const err = new Error('timeout error')
        invokeMap.deleteItem(id)
        this.handleGlobalError(err)
        reject(err)
      }, timeout * 100)

      _reject = err => {
        clearTimeout(timer)
        invokeMap.deleteItem(id)
        this.handleGlobalError(err)
        reject(err)
      }

      _resolve = res => {
        clearTimeout(timer)
        invokeMap.deleteItem(id)
        resolve(res)
      }
    })

    promise.resolve = _resolve
    promise.reject = _reject

    return promise
  }

  handleGlobalError = () => {}
}


import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
import invokeMap from './utils/invokeMap'
import { INVOKE_TIMEOUT } from './constants'
import EventEmitter from './utils/EventEmitter'
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

  invoke = packet => {
    const { method, isCurrent } = packet
    const invokePacket = new InvokePacket({
      ...packet,
      origin: this.service,
    })
    const promise = this.genPromise(invokePacket)

    invokeMap.setItem({ ...invokePacket, promise })

    if (isCurrent) {
      this.emit(method, invokePacket)
    } else {
      sendToParentIframe(invokePacket)
    }

    return promise
  }

  handleResponse = packet => {
    const { id, payload: { result } } = packet
    const invokePacket = invokeMap.deleteItem(id)
    invokePacket.promise.resolve(result)
  }

  onMessage = async event => {
    const packet = event.data
    const { type, eventName } = packet

    switch (type) {
      case TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.invoke({ ...packet, isCurrent: true })
          sendToParentIframe(new ResponsePacket({ ...packet, payload: { result } }))
        } catch (e) { /* do nothing */ }
        break

      case TOS_RESPONSE_PACKET_TYPE:
        this.handleResponse(packet)
        break

      case TOS_EVENT_PACKET_TYPE:
        this.emit(eventName, packet.payload)
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


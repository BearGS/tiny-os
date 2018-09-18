import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
import { INVOKE_TIMEOUT } from './constants'
import EventEmitter from './utils/EventEmitter'
import { InvokePacket, ResponsePacket } from './packet'
import { sendToParentIframe } from './utils/communication'

const invokeMap = new Map()

function delOneInvoke (id) {
  return invokeMap.delete(id)
}

function addOneInvoke (packet) {
  const { id } = packet
  return invokeMap.set(id, packet)
}

function getOneInvoke (id) {
  return invokeMap.get(id)
}

/**
 * Message-Oriented Middleware
 */
export default class MomSDK extends EventEmitter {
  constructor (name) {
    super()
    window.addEventListener('message', this.onMessage.bind(this))
    this.name = name
  }

  invoke = packet => {
    const { method, isCurrent } = packet
    const invokePacket = new InvokePacket({
      ...packet,
      origin: this.name,
    })
    const promise = this.genPromise(invokePacket)

    addOneInvoke({ ...invokePacket, promise })

    if (isCurrent) {
      this.emit(method, invokePacket)
    } else {
      sendToParentIframe(invokePacket)
    }

    return promise
  }

  response = packet => {
    const { id } = packet
    const invokePacket = getOneInvoke(id)
    invokePacket.promise.resolve(packet.payload.result)
    delOneInvoke(id)
  }

  onMessage = async event => {
    const packet = event.data
    const {
      // id,
      type,
      eventName,
    } = packet
    switch (type) {
      case TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.invoke({ ...packet, isCurrent: true })
          sendToParentIframe(new ResponsePacket({ ...packet, payload: { result } }))
        } catch (e) { /* do nothing */ }
        break

      case TOS_RESPONSE_PACKET_TYPE:
        this.response(packet)
        break

      case TOS_EVENT_PACKET_TYPE:
        this.emit(eventName, packet)
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
        delOneInvoke(id)
        this.handleGlobalError(err)
        reject(err)
      }, timeout * 100)

      _reject = err => {
        clearTimeout(timer)
        delOneInvoke(id)
        this.handleGlobalError(err)
        reject(err)
      }

      _resolve = res => {
        clearTimeout(timer)
        delOneInvoke(id)
        resolve(res)
      }
    })

    promise.resolve = _resolve
    promise.reject = _reject

    return promise
  }

  handleGlobalError = () => {}
}


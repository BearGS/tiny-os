import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
import appManager from './AppManager'
import moduleManager from './ModuleManager'
import EventEmitter from './utils/EventEmitter'
import { INVOKE_TIMEOUT, Role } from './constants'
import { InvokePacket, ResponsePacket } from './packet'
import { sendToChildIframe } from './utils/communication'

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
export default class MomOS extends EventEmitter {
  constructor () {
    super()
    window.addEventListener('message', this.onMessage.bind(this))
  }

  invoke = packet => {
    const invokePacket = new InvokePacket(packet)
    const { service, method } = invokePacket
    const promise = this.genPromise(invokePacket)
    addOneInvoke({ ...invokePacket, promise })

    const isModule = moduleManager.hasModule(service)
    const isApp = appManager.hasApp(service)
    const isOs = service === Role.OS

    if (isModule) {
      /* */
    } else if (isApp) {
      sendToChildIframe(appManager.getApp(service).iframe, invokePacket)
    } else if (isOs) {
      this.emit(method, invokePacket)
    }

    return promise
  }

  response = packet => {
    const { id } = packet
    const invokePacket = getOneInvoke(id)

    invokePacket.promise.resolve(packet.payload.result)
  }

  onMessage = async event => {
    const packet = event.data
    const {
      type,
      eventName,
      origin,
    } = packet

    switch (type) {
      case TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.invoke(packet)

          sendToChildIframe(
            appManager.getApp(origin).iframe,
            new ResponsePacket({ ...packet, payload: { result } }),
          )
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
        const err = new Error(`tiny-os Invoke Error: Timeout Error, invokeId: ${id}`)
        delOneInvoke(id)
        this.handleGlobalError(err)
        reject(err)
      }, timeout)

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


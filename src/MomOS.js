import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
import appManager from './AppManager'
import invokeMap from './utils/invokeMap'
import invariant from './utils/invariant'
import moduleManager from './ModuleManager'
import EventEmitter from './utils/EventEmitter'
import { INVOKE_TIMEOUT, Role } from './constants'
import { sendToChildIframe } from './utils/communication'
import { InvokePacket, ResponsePacket, EventPacket } from './packet'

/**
 * Message-Oriented Middleware
 */
class MomOS extends EventEmitter {
  constructor () {
    if (typeof MomOS.instance === 'object'
      && MomOS.instance instanceof MomOS) {
      return MomOS.instance
    }

    super()

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
    })
    const promise = this.genPromise(invokePacket)
    invokeMap.setItem({ ...invokePacket, promise })

    this.dispatchInvoke(invokePacket)

    return promise
  }

  onInvoke = packet => {
    const promise = this.genPromise(packet)
    invokeMap.setItem({ ...packet, promise })

    this.dispatchInvoke(packet)

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

  handleResponse = data => {
    const { id, result } = data
    const invokePacket = invokeMap.deleteItem(id)
    invokePacket.promise.resolve(result)
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
  sendToSelf = (method, packet) => this.emit(method, packet)

  onMessage = async event => {
    const packet = event.data
    const {
      id,
      type,
      eventName,
      origin,
    } = packet

    const targetApp = appManager.getApp(origin)

    switch (type) {
      case TOS_INVOKE_PACKET_TYPE:
        try {
          const result = await this.onInvoke(packet)
          this.sendToApp(
            targetApp,
            new ResponsePacket({ ...packet, payload: { result } }),
          )
        } catch (e) { /* do nothing */ }
        break

      case TOS_RESPONSE_PACKET_TYPE:
        this.handleResponse({ id, result: packet.payload.result })
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
        invokeMap.deleteItem(id)
        this.handleGlobalError(err)
        reject(err)
      }, timeout)

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

export default new MomOS()


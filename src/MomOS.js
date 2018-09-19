import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
} from './tosSymbols'
import appManager from './AppManager'
import invokeMap from './utils/invokeMap'
import moduleManager from './ModuleManager'
import EventEmitter from './utils/EventEmitter'
import { INVOKE_TIMEOUT, Role } from './constants'
import { InvokePacket, ResponsePacket, EventPacket } from './packet'
import { sendToChildIframe } from './utils/communication'
import invariant from './utils/invariant'

/**
 * Message-Oriented Middleware
 */
// export default class MomOS extends EventEmitter {
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
    const invokePacket = new InvokePacket(packet)
    const { service, method } = invokePacket
    const promise = this.genPromise(invokePacket)
    const module = moduleManager.getModule(service)
    const app = appManager.getApp(service)
    const isMomOS = service === Role.OS

    if (module) {
      /* */
    } else if (isMomOS) {
      this.sendToSelf(method, invokePacket)
    } else if (app) {
      this.sendToApp(app, invokePacket)
    }

    invokeMap.setItem({ ...invokePacket, promise })

    return promise
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
          const result = await this.invoke(packet)
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


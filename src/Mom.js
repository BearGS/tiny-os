import invokeMap from './utils/invokeMap'
import { INVOKE_TIMEOUT } from './constants'
import EventEmitter from './utils/EventEmitter'

/**
 * Message-Oriented Middleware
 */
export default class Mom extends EventEmitter {
  handleResponse = data => {
    const { id, result } = data
    const invokePacket = invokeMap.deleteItem(id)

    invokePacket.promise.resolve(result)
  }

  sendToSelf = (method, packet) => this.emit(method, packet)

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


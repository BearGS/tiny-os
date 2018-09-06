import uuid from './utils/uuid'
import {
  TOS_REQUEST_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE
} from './tosSymbols'
import invariant from './utils/invariant'
import { MethodType, ServiceType } from './constants'

class Packet {
  /**
   * @param  {String} origin // rpc caller, it can be App, Module, Worker, os self
   * @param  {String} service // rpc service, it can be App, Module, Worker
   * @param  {String} method // rpc method
   * @param  {Object} params
   */
  constructor ({
    origin,
    service,
    method,
    params = {},
  } = {}) {
    invariant(
      typeof service !== ServiceType ||
        service === '' ||
        service == null,
      'parmas module must not be null or undefined or empty string' +
        `and must be \`${ServiceType}\` type`,
    )

    invariant(
      typeof method !== MethodType ||
        method === '' ||
        method == null,
      'parmas method must not be null or undefined or empty string' +
        `and must be \`${MethodType}\` type`,
    )

    this.origin = origin
    this.service = service
    this.method = method
    this.params = params
  }
}

export class InvokePacket extends Packet {
  constructor (payload) {
    super(payload)
    this.id = uuid()
    this.type = TOS_REQUEST_PACKET_TYPE
  }
}

export class ResponsePacket extends Packet {
  constructor (payload) {
    super(payload)
    this.id = payload.id
    this.type = TOS_RESPONSE_PACKET_TYPE
  }
}

export class EventPacket {
  constructor (params) {
    this.id = uuid()
    this.type = TOS_EVENT_PACKET_TYPE
    this.params = params
  }
}

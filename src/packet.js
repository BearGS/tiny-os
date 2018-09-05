// import uuidV4 from 'uuid/v4'
import {
  TOS_REQUEST_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE
} from './tosSymbols'
import invariant from './utils/invariant'
import { MethodType, ServiceType } from './constants'

class Packet {
  /**
   * @param  {String} service // rpc service, it can be App, Module, Worker
   * @param  {String} method // rpc method
   * @param  {Object} params
   */
  constructor ({
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

    this.service = service
    this.method = method
    this.params = params
  }
}

export class InvokePacket extends Packet {
  constructor (payload) {
    super(payload)
    // this.id = uuidV4()
    this.type = TOS_REQUEST_PACKET_TYPE
  }
}

export class ResponsePacket extends Packet {
  constructor (payload) {
    super(payload)
    this.type = TOS_RESPONSE_PACKET_TYPE
  }
}

export class EventPacket {
  constructor ({ params }) {
    // this.id = uuidV4()
    this.type = TOS_EVENT_PACKET_TYPE
    this.params = params
  }
}

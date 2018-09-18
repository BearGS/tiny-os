import {
  TOS_INVOKE_PACKET_TYPE,
  TOS_EVENT_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE
} from './tosSymbols'
import uuid from './utils/uuid'
import { checkType } from './utils/checkType'
import requiredParam from './utils/requiredParam'
import { MethodType, ServiceType } from './constants'

export class InvokePacket {
  constructor ({
    origin,
    originType,
    service = requiredParam('service'),
    method = requiredParam('method'),
    payload = {},
  } = {}) {
    checkType(ServiceType)(service)
    checkType(MethodType)(method)

    this.id = uuid()
    this.service = service
    this.method = method
    this.payload = payload
    this.origin = origin
    this.originType = originType
    this.type = TOS_INVOKE_PACKET_TYPE
  }
}

export class ResponsePacket {
  constructor ({
    id,
    origin,
    originType,
    payload = {},
  } = {}) {
    this.id = id
    this.payload = payload
    this.origin = origin
    this.originType = originType
    this.type = TOS_RESPONSE_PACKET_TYPE
  }
}

export class EventPacket {
  constructor ({
    eventName = requiredParam('eventName'),
    payload = {},
  } = {}) {
    this.id = uuid()
    this.payload = payload
    this.eventName = eventName
    this.type = TOS_EVENT_PACKET_TYPE
  }
}

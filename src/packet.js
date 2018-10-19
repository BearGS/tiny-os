import uuid from './utils/uuid'
import { checkType } from './utils/checkType'
import requiredParam from './utils/requiredParam'
import { MethodType, ServiceType, PacketType } from './constants'

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
    this.type = PacketType.TOS_INVOKE_PACKET_TYPE
  }
}

export class ResponsePacket {
  constructor ({
    id,
    service,
    origin,
    originType,
    payload = {},
  } = {}) {
    this.id = id
    this.payload = payload
    this.service = service
    this.origin = origin
    this.originType = originType
    this.type = PacketType.TOS_RESPONSE_PACKET_TYPE
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
    this.type = PacketType.TOS_EVENT_PACKET_TYPE
  }
}

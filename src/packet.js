import uuidV4 from 'uuid/v4'
import {
  TOS_REQUEST_PACKET_TYPE,
  TOS_MESSAGE_PACKET_TYPE,
  TOS_RESPONSE_PACKET_TYPE
} from './tosSymbols'
import { ProcedureType, ModuleType } from './constants'
import invariant from './utils/invariant';

class Packet {
  /**
   * @param  {String} module   the module to be executed in os
   * @param  {[type]} procedure the procedure to be executed in module
   * @param  {Object} params    params for procedure
   * @example:
   */
  constructor ({
    module, 
    procedure, 
    params = {},
  } = {}) {
    invariant(
      typeof module !== ModuleType || 
        module === '' ||
        module == null,
      `parmas module must not be null or undefined or empty string` +
        `and must be \`${ModuleType}\` type`,
    )
    invariant(
      typeof procedure !== ProcedureType || 
        procedure === '' ||
        procedure == null,
      `parmas procedure must not be null or undefined or empty string` +
        `and must be \`${ProcedureType}\` type`,
    )
    this.id = uuidV4()
    this.module = module
    this.procedure = procedure
    this.params = params
  }
}

export class RequestPacket extends Packet {
  constructor (payload) {
    super(payload)
    this.type = TOS_REQUEST_PACKET_TYPE
  }
}

export class ResponsePacket extends Packet {
  constructor (payload) {
    super(payload)
    this.type = TOS_RESPONSE_PACKET_TYPE
  }
}

export class messagePacket extends Packet {
  constructor (payload) {
    super(payload)
    this.type = TOS_MESSAGE_PACKET_TYPE
  }
}
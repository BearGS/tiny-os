const hasSymbol = typeof Symbol === 'function' && Symbol.for

export const TOS_REQUEST_PACKET_TYPE = hasSymbol
  ? Symbol.for('tos.invoke.packet')
  : 0xeac1

export const TOS_EVENT_PACKET_TYPE = hasSymbol
  ? Symbol.for('tos.event.packet')
  : 0xeac2

export const TOS_RESPONSE_PACKET_TYPE = hasSymbol
  ? Symbol.for('tos.response.packet')
  : 0xeac3


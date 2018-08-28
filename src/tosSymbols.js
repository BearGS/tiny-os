// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
const hasSymbol = typeof Symbol === 'function' && Symbol.for

export const TOS_REQUEST_PACKET_TYPE = hasSymbol
  ? Symbol.for('tos.request.packet')
  : 0xeac1

export const TOS_MESSAGE_PACKET_TYPE = hasSymbol
  ? Symbol.for('tos.message.packet')
  : 0xeac2

export const TOS_RESPONSE_PACKET_TYPE = hasSymbol
  ? Symbol.for('tos.response.packet')
  : 0xeac3


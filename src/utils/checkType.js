import invariant from './invariant'

export const checkType = (type, name = '') =>
  data => {
    invariant(
      typeof data !== type,
      `params \`${name}\` must be \`${type}\`, but received \`${data}\``,
    )

    return data
  }

export const checkTypeString = checkType('string')
export const checkTypeNumber = checkType('number')
export const checkTypeBoolean = checkType('boolean')
export const checkTypeFunction = checkType('function')

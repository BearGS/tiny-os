/* eslint-disable */
let validateFormat = () => {}

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument')
    }
  }
}

export default function invariant(condition, format, ...args) {
  validateFormat(format)

  if (condition) {
    let error
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.',
      )
    } else {
      let argIndex = 0
      error = new Error(format.replace(/%s/g, () => args[argIndex++]))
      error.name = 'Invariant Violation'
    }

    error.framesToPop = 1 // we don't care about invariant's own frame
    throw error
  }
}


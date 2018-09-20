const compose = (...fns) => param => fns.reduce((result, fn) => fn(result), param)

export default compose

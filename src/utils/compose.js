export default function compose (...fns) {
  return param => fns.reduce(
    (result, fn) => fn(result),
    param
  )
}

import invariant from './invariant'

export default function requiredParam (data) {
  invariant(
    true,
    `param \`${data}\` must not be null or undefined`
  )

  return data
}

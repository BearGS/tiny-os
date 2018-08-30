/* eslint-disable no-param-reassign */
// export function insert(iframe, target) {
//   target.appendChild(iframe)
// }

export function createIframe(container, name, uri) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('id', name)
  iframe.setAttribute('src', uri)
  iframe.setAttribute(
    'sandbox',
    'allow-forms allow-same-origin allow-scripts allow-popups'
  )
  iframe.style.border = 'none'
  iframe.style.display = 'none'
  container.appendChild(iframe)

  return iframe
}

export function hideIframe(iframe) {
  iframe.style.display = 'none'
}

export function showIframe(iframe) {
  iframe.style.display = null
}

export function removeIframe (container, iframeId) {
  const iframe = document.getElementById(iframeId)
  container.removeChild(iframe)
}

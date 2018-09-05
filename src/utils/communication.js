export function sendToChildIframes (iframes, msg) {
  iframes.forEach(iframe => sendToChildIframe(iframe, msg))
}

export function sendToChildIframe (childIframe, msg) {
  childIframe.contentWindow.postMessage(msg, '*')
}

export function sendToParentIframe (msg) {
  window.parent.postMessage(msg, '*')
}

export function sendToChildIframes (iframes, msg) {
  iframes.forEach(iframe => sendToChildIframe(iframe, msg))
}

export function sendToChildIframe (childIframe, msg) {
  childIframe.contentWindow.postMessage(msg, '*')
}

export function sendToParentIframe (msg) {
  if (window.parent !== window) {
    window.parent.postMessage(msg, '*')
  }
}

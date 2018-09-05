/* eslint-disable no-use-before-define */

// createRouterManager.js
const createRouterManager = () => {
  let listeners = []

  const notify = (...args) => listeners.forEach(listener => listener(...args))

  const add = fn => {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter(item => item !== fn)
    }
  }

  return { notify, add }
}

// createHistoryFactory.js
export default function createHistoryFactory (originHistory) {
  const PopStateEvent = 'popstate'
  const HashChangeEvent = 'hashchange'
  const routeManager = createRouterManager()
  const listen = fn => routeManager.add(fn)

  const setState = ({
    path = history.location.pathname,
    state = history.state,
    hash = history.location.hash.slice(1),
  } = {}) => routeManager.notify({ path, state, hash })

  const handlePopState = () => {}
  const handleHashChange = setState

  window.addEventListener(PopStateEvent, handlePopState)
  window.addEventListener(HashChangeEvent, handleHashChange)

  const go = n => originHistory.go(n)
  const back = () => originHistory.go(-1)
  const forward = () => originHistory.go(1)
  const push = (path, state) => {
    originHistory.pushState(state, '', path)
    setState()
  }
  const replace = (path, state) => {
    originHistory.replaceState(state, '', path)
    setState()
  }
  const setHash = ({ hash }) => {
    if (history.location.hash !== `#${hash}`) {
      originHistory.pushState(null, null, `#${hash}`)
      setState()
    }
  }

  const history = {
    go,
    back,
    forward,
    push,
    replace,
    setHash,
    listen,
    state: originHistory.state,
    length: originHistory.length,
    location: window.location,
  }

  return history
}


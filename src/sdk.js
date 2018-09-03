export default class Sdk {
  constructor () {
    if (typeof Sdk.instance === 'object'
      && Sdk.instance instanceof Sdk) {
      return Sdk.instance
    }
    Object.defineProperty(Sdk, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })
  }

  invoke = () => new Promise()

  onRegister = () => {
  }

  onLoad = () => {

  }

  onUnload = () => {

  }

  onOpen = () => {

  }

  onUnopen = () => {

  }

  onSuspend = () => {

  }

  onKill = () => {

  }
}

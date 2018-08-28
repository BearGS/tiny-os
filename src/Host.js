export default class Host {
  constructor () {
    if (typeof Host.instance === 'object'
      && Host.instance instanceof Host) {
      return Host.instance;
    }
    Object.defineProperty(Host, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })
  }
}
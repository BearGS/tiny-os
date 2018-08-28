export default class App {
  constructor () {
    if (typeof App.instance === 'object'
      && App.instance instanceof App) {
      return App.instance;
    }
    Object.defineProperty(App, 'instance', {
      value: this,
      configurable: false,
      writable: false,
    })
  }

  invoke = () => {
    return new Promise()
  }

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
export default class EventEmitter {
  eventHub = {}

  on = (eventName, callback) => {
    const callbacks = this.eventHub[eventName] || []
    callbacks.push(callback)
    this.eventHub[eventName] = callbacks

    return () => {
      this.eventHub[eventName] = callbacks.filter(fn => fn !== callback)
    }
  }

  off = eventName => {
    this.eventHub[eventName] = []
  }

  emit = (eventName, args) => {
    const callbacks = this.eventHub[eventName] || []

    callbacks.forEach(cb => cb(args))
  }
}

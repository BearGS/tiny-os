const invokeMap = new Map()

export default {
  getItem (id) {
    return invokeMap.get(id)
  },

  setItem (packet) {
    const { id } = packet
    return invokeMap.set(id, packet)
  },

  deleteItem (id) {
    const item = invokeMap.get(id)
    invokeMap.delete(id)

    return item
  },
}

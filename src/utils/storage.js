const datas = {}

export default {
  getItem (key) {
    return datas[key]
  },

  setItem (key, value) {
    datas[key] = value
  },

  deleteItem (key) {
    delete datas[key]
  },
}

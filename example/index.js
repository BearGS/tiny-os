// import TOS from '../dist/os.esm'
import TOS from '../src/os'
import appData from './js/appData'
import configs from './js/configs'

if (module.hot) {
  module.hot.accept()
}

const tos = new TOS(configs)

// tos.launchApp('order')

tos.registerMethod('fetchOsCount', () => `osCount: ${Math.round(Math.random() * 100)}`)
tos.registerMethod('osKsid', () => 'KSID:AG3nmDLI8EHhf8LIe2nSjDAbDF')

appData.map(data => data.name)
  .forEach(name => {
    document.getElementById(`app-${name}`)
      .addEventListener('click', () => {
        tos.launchApp(name)
      })
  })

document.getElementById('app-nonapp')
  .addEventListener('click', () => tos.launchApp('nonapp'))

document.getElementById('fetch-order-count')
  .addEventListener('click', () => {
    tos.invoke({
      service: 'order',
      method: 'fetchOrderCount',
    })
      .then(result => {
        document.getElementById('count').innerHTML = result
      })
      .catch(e => window.alert(e.message)) // eslint-disable-line
  })
document.getElementById('fetch-goods-count')
  .addEventListener('click', () => {
    tos.invoke({
      service: 'goods',
      method: 'fetchGoodsCount',
    })
      .then(result => {
        document.getElementById('count-goods').innerHTML = result
      })
      .catch(e => window.alert(e.message)) // eslint-disable-line
  })

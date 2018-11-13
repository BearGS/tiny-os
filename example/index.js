// import tos from '../dist/os.esm'
import SDK from '../src/sdk'
import tos from '../src/os'
import appData from './js/appData'
import configs from './js/configs'

if (module.hot) {
  module.hot.accept()
}

tos.init(configs)
tos.init(configs)

// tos.launchApp('order')

tos.registerMethod('fetchOsCount', () => `osCount: ${Math.round(Math.random() * 100)}`)
tos.registerMethod('osKsid', () => 'KSID:AG3nmDLI8EHhf8LIe2nSjDAbDF')
tos.registerMethod('osKsid2', () => 'KSID2:AG3nmDLI8EHhf8LIe2nSjDAbDF')
tos.registerValue('shopId', '150009413')

const sdk = new SDK('TEST-UNUSEFUL-SDK')
sdk.registerMethod('fetchOsCount', () => `TEST-UNUSEFUL-SDK: ${Math.round(Math.random() * 100)}`)
sdk.registerMethod('osKsid', () => 'TEST-UNUSEFUL-SDK:AG3nmDLI8EHhf8LIe2nSjDAbDF')
sdk.registerMethod('osKsid2', () => 'TEST-UNUSEFUL-SDK2:AG3nmDLI8EHhf8LIe2nSjDAbDF')

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

document.getElementById('fetch-own-count')
  .addEventListener('click', () => {
    tos.invoke({
      service: 'OS',
      method: 'fetchOsCount',
    })
      .then(result => {
        document.getElementById('count-own').innerHTML = result
      })
      .catch(e => window.alert(e.message)) // eslint-disable-line
  })

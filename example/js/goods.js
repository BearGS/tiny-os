// import SDK from '../../dist/sdk.esm'
import SDK from '../../src/sdk'
import os from '../../src/os'

const sdk = new SDK('goods')

os.registerMethod('fetchGoodsOwnOsCount', () => `goodsOwnOsCount: ${Math.round(Math.random() * 100)}`)
sdk.registerMethod('fetchGoodsCount', () => `goodsCount: ${Math.round(Math.random() * 100)}`)
sdk.onLaunchApp(data => {
  console.log('goods app: launchApp ====== ', data) // eslint-disable-line
})
sdk.onLoadApp(data => {
  console.log('goods app: loadApp ====== ', data) // eslint-disable-line
})
sdk.onSuspendApp(data => {
  console.log('goods app: suspendApp ====== ', data) // eslint-disable-line
})

document.getElementById('fetch-order-count')
  .addEventListener('click', () => {
    sdk.invoke({
      service: 'order',
      method: 'fetchOrderCount',
    })
      .then(result => {
        document.getElementById('count').innerHTML = result
      })
      .catch(e => console.log(e.message)) // eslint-disable-line
  })

document.getElementById('fetch-goods-own-os-count')
  .addEventListener('click', () => {
    os.invoke({
      service: 'OS',
      method: 'fetchGoodsOwnOsCount',
    })
      .then(result => {
        document.getElementById('count-own-os').innerHTML = result
      })
      .catch(e => window.alert(e.message)) // eslint-disable-line
  })

document.getElementById('fetch-os-count')
  .addEventListener('click', () => {
    sdk.invoke({
      service: 'OS',
      method: 'fetchOsCount',
    })
      .then(result => {
        document.getElementById('count-os').innerHTML = result
      })
      .catch(e => window.alert(e.message)) // eslint-disable-line
  })

document.getElementById('launch-app')
  .addEventListener('click', () => sdk.launchApp('order'))


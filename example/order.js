import SDK from '../src/sdk'

const sdk = new SDK('order')
sdk.registerMethod('fetchOrderCount', () => `orderCount: ${Math.round(Math.random() * 100)}`)

sdk.onLaunchApp(data => {
  console.log('order app: launchApp ====== ', data) // eslint-disable-line
})

sdk.onLoadApp(data => {
  console.log('order app: loadApp ====== ', data) // eslint-disable-line
})

sdk.onSuspendApp(data => {
  console.log('order app: suspendApp ====== ', data) // eslint-disable-line
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

document.getElementById('fetch-os-ksid')
  .addEventListener('click', () => {
    sdk.invoke({
      service: 'OS',
      method: 'osKsid',
    })
      .then(result => {
        document.getElementById('os-ksid').innerHTML = result
      })
      .catch(e => window.alert(e.message)) // eslint-disable-line
  })

document.getElementById('launch-app')
  .addEventListener('click', () => sdk.launchApp('goods'))


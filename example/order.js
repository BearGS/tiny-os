import SDK from '../src/sdk'

const sdk = new SDK('order')
sdk.registerMethod('fetchOrderCount', () => `orderCount: ${Math.round(Math.random() * 100)}`)

sdk.onLaunchApp(data => {
  console.log('receive data ===', data) // eslint-disable-line
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

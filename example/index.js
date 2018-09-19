// import { TOS } from '../src/'
// import appData from './appData'

// if (module.hot) {
//   module.hot.accept()
// }

// const tos = new TOS()
// tos.configContainer('app-container')
// tos.registerAll(appData)

// appData.map(data => data.name)
//   .forEach(name => {
//     document.getElementById(`app-${name}`)
//       .addEventListener('click', () => tos.launchApp(name))
//   })

// document.getElementById('app-nonapp')
//   .addEventListener('click', () => tos.launchApp('nonapp'))

import TOS from '../src/os'
import appData from './appData'
import configs from './configs'

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

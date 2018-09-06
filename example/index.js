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
// const sdk = new SDK()
// console.log(sdk)

appData.map(data => data.name)
  .forEach(name => {
    document.getElementById(`app-${name}`)
      .addEventListener('click', () => tos.launchApp(name))
  })

document.getElementById('app-nonapp')
  .addEventListener('click', () => tos.launchApp('nonapp'))

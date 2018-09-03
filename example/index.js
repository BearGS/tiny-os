// import { TOS } from '../src/'
// import appData from './appData'

// if (module.hot) {
//   module.hot.accept()
// }

// const tos = new TOS()
// tos.configContainer('app-container')
// // tos.registerAll(appData)
// tos.registerApp(appData)
// // tos.launchApp('order')

// const a = [appData]
// a.map(data => data.name)
//   .forEach(name => {
//     document.getElementById(`app-${name}`)
//       .addEventListener('click', () => tos.launchApp(name))
//   })

import { TOS } from '../src/'
import appData from './appData'

if (module.hot) {
  module.hot.accept()
}

const tos = new TOS()
tos.configContainer('app-container')
tos.registerAll(appData)

appData.map(data => data.name)
  .forEach(name => {
    document.getElementById(`app-${name}`)
      .addEventListener('click', () => tos.launchApp(name))
  })

document.getElementById('app-nonapp')
  .addEventListener('click', () => tos.launchApp('nonapp'))


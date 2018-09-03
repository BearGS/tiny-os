import { TOS } from '../src/'
import appData from './appData'

if (module.hot) {
  module.hot.accept()
}

const tos = new TOS()
tos.configContainer('app-container')
tos.registerAll(appData)
// tos.launchApp('order')

appData.map(data => data.name)
  .forEach(name => {
    document.getElementById(`app-${name}`)
      .addEventListener('click', () => tos.launchApp(name))
  })


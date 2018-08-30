import { Host } from '../src/'
import appData from './appData'

if (module.hot) {
  module.hot.accept()
}

const host = new Host()
host.configContainer('app-container')
host.registerAll(appData)
host.launchApp('order')

appData.map(data => data.name)
  .forEach(name => {
    document.getElementById(`app-${name}`)
      .addEventListener('click', () => host.launchApp(name))
  })


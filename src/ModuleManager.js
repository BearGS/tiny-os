/* eslint-disable no-param-reassign */
import Module, { _modules } from './Module'
import invariant from './utils/invariant'

class ModuleManager {
  use = ({
    name,
    module,
  } = {}) => {
    invariant(
      !name || typeof name !== 'string',
      'Invalid params name',
    )

    invariant(
      this.getModule(name),
      `you've already register another module named \`${name}\``,
    )

    _modules.push(new Module({ name, module }))
  }

  useAll = modules => modules.forEach(module => this.use(module))
  getModule = moduleName => (_modules.find(module => module.name === moduleName) || {}).module
}

export default new ModuleManager()


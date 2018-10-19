/* eslint-disable no-param-reassign */
import Module, { _modules } from './Module'
import invariant from './utils/invariant'
import { checkTypeString } from './utils/checkType'
import requiredParam from './utils/requiredParam'
// import compose from './utils/compose'

class ModuleManager {
  use = ({
    name = requiredParam('name'),
    module,
  } = {}) => {
    checkTypeString(name)

    invariant(
      name === '',
      'param `name` must not be empty string'
    )

    invariant(
      this.getModule(name),
      `you've already register another module named \`${name}\``,
    )

    _modules.push(new Module({ name, module }))
  }

  useAll = modules => modules.forEach(module => this.use(module))
  getModule = moduleName => (_modules.find(module => module.name === moduleName) || {}).module
  hasModule = moduleName => _modules.some(module => module.name === moduleName)
}

export default new ModuleManager()


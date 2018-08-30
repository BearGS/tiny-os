const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  dotenv: resolveApp('env/.env'),
  appRollup: resolveApp('rollup/rollup.config.prod.js'),
  appDist: resolveApp('example/dist'),
  appBuild: resolveApp('webpack'),
  appPublic: resolveApp('example/public'),
  appHtml: resolveApp('example/index.html'),
  appIndexJs: resolveApp('example/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('/'),
  appNodeModules: resolveApp('node_modules'),
}

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
  orderHtml: resolveApp('example/order.html'),
  appIndexJs: resolveApp('example/index.js'),
  appOrderJs: resolveApp('example/js/order.js'),
  appGoodsJs: resolveApp('example/js/goods.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('/'),
  appNodeModules: resolveApp('node_modules'),
}

const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('./webpack.config.dev')
const opn = require('opn')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  host: 'localhost',
  port: 8080,
  compress: true,
  publicPath: '/',
  inline: true,
  hot: true,
  noInfo: false,
  overlay: true,
  historyApiFallback: true,
  stats: { colors: true },
})
server.listen(8080, 'localhost', () => {
  console.log('> Listening at http://localhost:8080\n')
  opn('http://localhost:8080')
})

// devServer: {
//   host: 'localhost',
//   port: 8080,
//   compress: true,
//   publicPath: '/',
//   inline: true,
//   hot: true,
//   noInfo: false,
//   overlay: true,
//   historyApiFallback: true,
// },

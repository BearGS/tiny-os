/* eslint-disable function-paren-newline */
const paths = require('../config/paths')
const { Config } = require('webpack-config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = new Config()
  .extend({
    './webpack/webpack.config.base.js': conf => {
      conf.entry.app.unshift(
        require.resolve('react-dev-utils/webpackHotDevClient'),
      )
      return conf
    },
  })
  .merge({
    mode: 'development',
    devtool: 'source-map',
    output: {
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.appHtml,
        filename: 'index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  })

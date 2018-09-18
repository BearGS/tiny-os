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
      conf.entry.order.unshift(
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
        chunks: ['app'],
        // inject: false,
      }),
      new HtmlWebpackPlugin({
        template: paths.orderHtml,
        filename: 'order.html',
        chunks: ['order'],
        // inject: false,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __DEV__: true
      }),
    ],
  })

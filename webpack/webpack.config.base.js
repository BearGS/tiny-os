const paths = require('../config/paths')

module.exports = {
  entry: {
    app: [paths.appIndexJs],
    order: [paths.appOrderJs],
    goods: [paths.appGoodsJs],
  },
  output: {
    path: paths.appDist,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx'],
    modules: [
      paths.appSrc,
      'node_modules',
    ],
    alias: {
      '@': paths.appSrc,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: /\.(js|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                ['env', {
                  targets: {
                    browsers: ['chrome > 50', 'ios > 6', 'android > 4.4'],
                  },
                  modules: false,
                }],
                'stage-2',
              ],
              plugins: [
                'transform-runtime',
                'transform-decorators-legacy',
                'react-hot-loader/babel',
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
}

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
        test: /\.(js|mjs)$/,
        include: paths.appSrc,
        use: {
          loader: require.resolve('babel-loader'),
          // options: {
          //   babelrc: false,
          //   presets: [
          //     [
          //       '@babel/preset-env',
          //       {
          //         useBuiltIns: 'usage',
          //         targets: {
          //           chrome: '40',
          //           ios: '8',
          //           android: '4.4'
          //         },
          //         modules: false
          //       }
          //     ]
          //   ],
          //   plugins: [
          //     '@babel/plugin-transform-runtime',
          //     '@babel/plugin-proposal-class-properties',
          //     ['@babel/plugin-proposal-decorators', { legacy: true }],
          //     'react-hot-loader/babel',
          //   ],
          //   cacheDirectory: false,
          // },
        }
      },
    ],
  },
}


// {
//   "presets": [
//     [
//       "@babel/preset-env",
//       {
//         "useBuiltIns": "usage",
//         "targets": {
//           "chrome": "40",
//           "ios": "8",
//           "android": "4.4"
//         },
//         "modules": false
//       }
//     ]
//   ],
//   "plugins": [
//     "@babel/plugin-transform-runtime",
//     "@babel/plugin-proposal-class-properties",
//     ["@babel/plugin-proposal-decorators", { "legacy": true }],
//   ]
// }

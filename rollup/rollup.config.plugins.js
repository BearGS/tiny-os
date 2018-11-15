const alias = require('rollup-plugin-alias')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

module.exports = {
  plugins: [
    alias({
      resolve: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV !== 'production' ? true : false,
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    eslint({
      include: ['src/**/*.js']
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            "targets": {
              "chrome": "50",
              "ios": "10",
            },
            "modules": false,
          },
        ],
      ],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
      ],
      runtimeHelpers: true,
    }),
    uglify(
      {
        compress: {
          drop_console: true
        }
      },
      minify
    ),
  ]
}

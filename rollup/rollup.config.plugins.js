const alias = require('rollup-plugin-alias')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

module.exports = {
  external: ['crypto'],
  plugins: [
    alias({
      resolve: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    eslint({
      include: ['src/**/*.js']
    }),
    babel({
      "ignore": [
        "node_modules/**"
      ],
      "env": {
        "test": {
          "presets": [
            ["env", {
              "targets": {
                "browsers": ["chrome > 50", "ios > 6", "android > 4.4"]
              }
            }],
            "stage-2"
          ]
        },
        "production": {
          "presets": [
            ["env", {
              "targets": {
                "browsers": ["chrome > 50", "ios > 6", "android > 4.4"]
              },
              "modules": false
            }],
            "stage-2"
          ],
          "plugins": ["external-helpers"]
        }
      }
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

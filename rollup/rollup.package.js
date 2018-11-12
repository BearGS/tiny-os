
/* eslint-disable import/no-dynamic-require */
const paths = require('../config/paths')

const { name, version, author } =  require(paths.appPackageJson)

const entries = {
  'tos': 'src/index.js',
  'os': 'src/os.js',
  'sdk': 'src/sdk.js',
}

const banner =
  `${'/*!\n * '}${name}.js v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`

const modules = Object.keys(entries)
  .map(key => ({
    input: entries[key],
    output: [
      {
        banner,
        format: 'umd',
        name: `${key}.umd.js`,
        file: `dist/${key}.umd.js`,  
      },
      {
        banner,
        format: 'cjs',
        name: `${key}.cjs.js`,
        file: `dist/${key}.cjs.js`,  
      },
      {
        banner,
        format: 'es',
        name: `${key}.esm.js`,
        file: `dist/${key}.esm.js`,  
      },
    ],
  }))

module.exports = modules

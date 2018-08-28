const { name, version, author } =  require('./package.json')

const entries = {
  'tiny-os': 'src/index.js',
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
        globals: {
          crypto: global.crypto,
        },
      },
      {
        banner,
        format: 'cjs',
        name: `${key}.cjs.js`,
        file: `dist/${key}.cjs.js`,  
        globals: {
          crypto: global.crypto,
        },
      },
      {
        banner,
        format: 'es',
        name: `${key}.esm`,
        file: `dist/${key}.esm.js`,  
        globals: {
          crypto: global.crypto,
        },
      },
    ],
  }))

module.exports = modules

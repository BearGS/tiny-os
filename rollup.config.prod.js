const ora = require('ora')
const rollup = require('rollup')
const baseOptions = require('./rollup.config.plugins')
const packages = require('./rollup.package')

async function build(inputOptions, outputOptions) {
  const spinner = ora(`loading ${outputOptions.name} options`).start()
  spinner.text = `start building ${outputOptions.name}...`
  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
  spinner.succeed(`${outputOptions.name} finish!`)
}

async function start() {
  packages.reduce((packPromise, pack) => {
    const { input, output: outputOptions } = pack
    return packPromise.then(() => 
    outputOptions.reduce((outputPromise, outputOption) => 
      outputPromise.then(() => 
            build({ input, ...baseOptions }, outputOption)
          )
        , Promise.resolve()
      )
    )
  }, Promise.resolve())
}
  
start()

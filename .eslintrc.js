module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true,
    jest: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'valid-typeof': 'off',
  }
}

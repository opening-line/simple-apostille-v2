module.exports = {
  root: true,
  env: {
    'es2016': true,
    'jest/globals': true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'project': './tsconfig.json',
  },
  plugins: [
    'jest',
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
}

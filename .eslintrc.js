module.exports = {
  root: true,
  env: {
    'jest/globals': true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'project': './tsconfig.json',
    createDefaultProgram: true,
  },
  plugins: [
    'jest',
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 'off'
  }
}

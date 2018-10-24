module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  settings: {
    react: {
      pragma: 'h'
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react'],
  parser: 'babel-eslint',
  rules: {}
}

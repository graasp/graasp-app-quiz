module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:cypress/recommended',
    'react-app',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    cy: true,
    Cypress: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  root: true, // For configuration cascading.
  rules: {},
  settings: {
    react: {
      version: 'detect', // Detect react version
    },
  },
};

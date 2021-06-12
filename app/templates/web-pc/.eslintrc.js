module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'prettier'
  ],
  env: {
    es6: true,
    browser: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    ecmaFeatures: { impliedStrict: true, jsx: false }
  },
  globals: {
    my: true,
    App: true,
    Component: true,
    Page: true,
    getApp: true,
    getRegExp: true,
    getCurrentPages: true
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.ts'], moduleDirectory: ['node_modules', 'src/'] }
    }
  },
  rules: {
    'no-console': 'warn',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['draft'] }
    ],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/prefer-default-export': 'off',
    'arrow-parens': 'off',
    'consistent-return': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'no-await-in-loop': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'class-methods-use-this': 'off'
  }
};

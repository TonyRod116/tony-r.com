module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-refresh'],
  overrides: [
    {
      files: ['scripts/**/*.js', 'scripts/**/*.mjs', 'tests/**/*.mjs', 'playwright*.js'],
      env: { node: true },
    },
  ],
  rules: {
    'react/jsx-uses-vars': 'error',
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}

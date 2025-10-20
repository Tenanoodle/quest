module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['dist', 'build', 'node_modules'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json', './web/tsconfig.json', './server/tsconfig.json'],
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended']
    },
    {
      files: ['web/**/*.tsx', 'web/**/*.ts'],
      env: {
        browser: true
      }
    },
    {
      files: ['server/**/*.ts'],
      env: {
        node: true
      }
    }
  ]
};

module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    //
    '@typescript-eslint/lines-between-class-members': 0,
    'prefer-destructuring': 0,
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    '@typescript-eslint/naming-convention': 0,
    'no-useless-return': 1,
    'react/jsx-props-no-spreading': 0,
    'react/destructuring-assignment': 0,
    'no-plusplus': 0,
    'no-continue': 0,
    'dot-notation': 0,
    '@typescript-eslint/dot-notation': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'react/require-default-props': 0,
    'react/jsx-curly-brace-presence': 0,
    'react/jsx-boolean-value': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-alert': 0,
    'promise/param-names': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};

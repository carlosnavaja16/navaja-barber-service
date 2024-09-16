import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
// import sonarjs from 'eslint-plugin-sonarjs';
// TODO: Add the sonarjs plugin when it supports the new flat config format
// https://github.com/SonarSource/SonarJS/issues/3968#issuecomment-2335197644

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      'apps/expo/metro.config.js',
      'apps/expo/babel.config.js',
      'apps/angular/.angular/*',
      'apps/expo/.expo/*'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];

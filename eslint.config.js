import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs['recommended'],
  stylistic.configs['recommended'],
  sonarjs.configs['recommended'],
  react.configs.flat['recommended'],
  react.configs.flat['jsx-runtime'],
  ...storybook.configs['flat/recommended'],
  reactRefresh.configs['vite'],
  {
    ignores: ['dist/**', 'public/**'],
  },
  {
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooks.configs['recommended'].rules,
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],

      /* sonarjs */
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-small-switch': 'off',
      'sonarjs/no-nested-functions': 'warn',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/no-dead-store': 'off',

      /* eslint */
      'eqeqeq': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      /* @stylistic - recommended */
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/no-multi-spaces': ['error',
        { ignoreEOLComments: true },
      ],
      '@stylistic/no-multiple-empty-lines': ['error',
        { max: 2, maxEOF: 1 },
      ],
      '@stylistic/object-property-newline': ['error',
        { allowAllPropertiesOnSameLine: true },
      ],
      '@stylistic/array-element-newline': ['error',
        {
          ArrayExpression: { multiline: true, consistent: true },
          ArrayPattern: { multiline: true, consistent: true },
        },
      ],
      '@stylistic/indent': ['error',
        2,
        {
          ImportDeclaration: 'off',
          SwitchCase: 1,
          flatTernaryExpressions: true,
        },
      ],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/object-curly-newline': ['error',
        {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true, consistent: true },
          ImportDeclaration: 'never',
          ExportDeclaration: 'never',
        },
      ],
      '@stylistic/jsx-self-closing-comp': ['error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  {
    files: ['**/*.stories.*'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
  { ignores: ['src/shadcn'] },
);

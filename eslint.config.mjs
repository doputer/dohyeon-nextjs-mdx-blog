import eslint from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  /* Ignores */
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },

  /* JavaScript */
  eslint.configs.recommended,

  /* TypeScript */
  tseslint.configs.recommended,

  /* Import */
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: '{next*,next*/**,@next*,@next*/**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '{react*,react*/**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['next', 'react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },

  /* Next.js */
  ...nextCoreWebVitals,

  //   /* Prettier */
  {
    extends: [prettierPlugin],
  }
);

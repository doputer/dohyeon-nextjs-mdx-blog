// import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

// const compat = new FlatCompat({
//   baseDirectory: import.meta.dirname,
// });

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  /* JavaScript */
  eslint.configs.recommended,

  /* TypeScript */
  tseslint.configs.recommended,

  /* Import */
  {
    extends: [importPlugin.flatConfigs.recommended],
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
  // ...compat.config({ extends: ['next', 'next/core-web-vitals'] }),

  //   /* Prettier */
  {
    extends: [prettierPlugin],
  }
);

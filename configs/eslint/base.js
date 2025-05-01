module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/react-in-jsx-scope': 'off',
  },
};

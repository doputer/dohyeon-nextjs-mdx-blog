/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  proseWrap: 'preserve',
  tailwindStylesheet: './src/static/styles/globals.css',
  tailwindFunctions: ['clsx', 'cn'],
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
};

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const defaults = {
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
  tailwindStylesheet: '../../src/static/styles/globals.css',
  tailwindFunctions: ['clsx', 'cn'],
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
};

module.exports = defaults;

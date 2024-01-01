/**
 * @type {import('prettier').Config & {
 *   tailwindFunctions: string[];
 * }}
 */
const config = {
  arrowParens: 'always',
  endOfLine: 'lf',
  jsxSingleQuote: false,
  plugins: ['prettier-plugin-jsdoc', 'prettier-plugin-tailwindcss'],
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['clsx'],
  trailingComma: 'all',
};

export default config;

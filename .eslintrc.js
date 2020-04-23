module.exports = {
  root: true,
  parserOptions: {
    parser: `babel-eslint`,
  },
  env: {
    browser: true,
  },
  extends: [
    `plugin:vue/recommended`,
    `standard`,
  ],
  plugins: [
    `vue`,
  ],
  rules: {
    'generator-star-spacing': `off`,
    'no-debugger': process.env.NODE_ENV === `production` ? `error` : `off`,
    quotes: [`error`, `backtick`],
    'object-curly-spacing': [`error`, `always`],
    'comma-dangle': [`error`, `always-multiline`],
    'vue/script-indent': [`error`, 2, { baseIndent: 1 }],
    'vue/attribute-hyphenation': [`error`, `never`],
    'vue/no-use-v-if-with-v-for': [`off`, { allowUsingIterationVar: true }],
  },
  overrides: [
    {
      files: [`*.vue`],
      rules: {
        indent: `off`,
      },
    },
  ],
  globals: {
    browser: true,
  },
}

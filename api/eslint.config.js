// eslint.config.js
const { defineConfig } = require("eslint/config")
const jest = require('eslint-plugin-jest')
const js = require("@eslint/js")

module.exports = defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "eol-last": ["error", "always"],
      "semi": ["error", "never"],

      // Optionally add other rules here
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },

  {
    files: ["**/*.test.js", "**/*.spec.js"],
    plugins: { jest },
    extends: ["jest/recommended"],
  },
])

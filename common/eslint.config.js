// eslint.config.js
const { defineConfig } = require("eslint/config")
const jest = require('eslint-plugin-jest')
const js = require("@eslint/js")


module.exports = defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js, jest },
    extends: [
      "js/recommended",
      "jest/recommended",
    ],

    languageOptions: {
      globals: {
        // ECMAScript
        ArrayBuffer: "readonly",
        Atomics: "readonly",
        BigInt: "readonly",
        BigInt64Array: "readonly",
        BigUint64Array: "readonly",
        DataView: "readonly",
        Float32Array: "readonly",
        Float64Array: "readonly",
        Int16Array: "readonly",
        Int32Array: "readonly",
        Int8Array: "readonly",
        Map: "readonly",
        Promise: "readonly",
        Proxy: "readonly",
        Reflect: "readonly",
        Set: "readonly",
        SharedArrayBuffer: "readonly",
        Symbol: "readonly",
        Uint16Array: "readonly",
        Uint32Array: "readonly",
        Uint8Array: "readonly",
        Uint8ClampedArray: "readonly",
        WeakMap: "readonly",
        WeakSet: "readonly",

        // ECMAScript (experimental)
        globalThis: "readonly",

        // ECMA-404
        Intl: "readonly",

        // Web Standard
        TextDecoder: "readonly",
        TextEncoder: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        WebAssembly: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        queueMicrotask: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",

        // Node.js
        Buffer: "readonly",
        GLOBAL: "readonly",
        clearImmediate: "readonly",
        global: "readonly",
        process: "readonly",
        root: "readonly",
        setImmediate: "readonly",

        // Node.js commonjs specific
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        module: "readonly",
        require: "readonly",
      },
    },

    rules: {
      "eol-last": ["error", "always"],
      "semi": ["error", "never"],

      "brace-style": ["error", "stroustrup", { "allowSingleLine": false }],
      "curly": ["error", "all"],

      "indent": ["error", 2, {
        "MemberExpression": 1,
        "SwitchCase": 1,
      }],

      "no-trailing-spaces": ["error", {
        "skipBlankLines": false,
        "ignoreComments": false
      }],

      "no-undef": "warn",
      'no-unused-vars': ['warn', {
        varsIgnorePattern: 'request|result[0-9]?',
      }],

      "jest/expect-expect": "off",
      "jest/no-standalone-expect": "off",
    },
  },
])

// eslint.config.js
import { defineConfig } from "eslint/config"
import vitestPlugin from 'eslint-plugin-vitest'
import js from "@eslint/js"

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: [
      "js/recommended",
    ],

    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
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

      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },

  {
    files: ["tests/**/*.js"],
    plugins: { vitest: vitestPlugin },
    extends: ["vitest/recommended"],
  },
])

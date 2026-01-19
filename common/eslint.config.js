// eslint.config.js
import { defineConfig } from "eslint/config"
import vitest from 'eslint-plugin-vitest'
import js from "@eslint/js"


export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/test/**',
      '**/test/**',
      'agricola/**',
    ],
  },
  {
    files: ["**/*.js"],
    plugins: { js, vitest },
    extends: [
      "js/recommended",
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
    },
  },
  {
    files: ["**/*.test.js", "**/testutil*.js"],
    plugins: { vitest },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/expect-expect": "off",
      "vitest/no-disabled-tests": "off",
      "vitest/no-standalone-expect": "off",
    },
  },
  // Allow CommonJS in dev scripts and agricola (not yet converted)
  {
    files: [
      "**/dev/**/*.js",
      "agricola/**/*.js",
    ],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },
])

// eslint.config.js
const { defineConfig } = require("eslint/config")
const js = require("@eslint/js")
const vue = require("eslint-plugin-vue")

module.exports = defineConfig([
  // Main app and Vue files
  {
    files: ["**/*.{js,vue}"],
    plugins: { js, vue },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: require('vue-eslint-parser'),
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
        globalThis: "readonly",
        Intl: "readonly",
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
        // Vue specific
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly"
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...vue.configs.base.rules,
      ...vue.configs.essential.rules,
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
      // Vue specific rules
      "vue/multi-word-component-names": "warn",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "warn",
      "vue/require-explicit-emits": "warn",
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true
      }],
      "vue/max-attributes-per-line": ["error", {
        "singleline": 3,
        "multiline": 1
      }],
      "vue/html-self-closing": ["error", {
        "html": {
          "void": "always",
          "normal": "always",
          "component": "always"
        }
      }]
    },
  },
  // Node.js config files
  {
    files: [
      "*.config.js",
      "babel.config.js",
      "vue.config.js",
      "eslint.config.js"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        module: "writable",
        require: "writable",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        process: "readonly"
      }
    }
  }
])

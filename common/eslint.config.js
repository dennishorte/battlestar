// eslint.config.js
const { defineConfig } = require("eslint/config")
const jest = require('eslint-plugin-jest')
const js = require("@eslint/js")


module.exports = defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/test/**',
      '**/test/**',
      'ik*',
    ],
  },
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
        varsIgnorePattern: '^_|request|result[0-9]?',
        argsIgnorePattern: '^_',
      }],

      "jest/expect-expect": "off",
      "jest/no-disabled-tests": "off",
      "jest/no-standalone-expect": "off",
    },
  },

  {
    files: ['**/*.test.js'],
    ignores: [
      'lib/**',                          // engine unit tests need internal access
      '**/testutil*.js',                 // testutil files are not test files anyway
      'dune/tests/cardEffects.test.js',  // pure parser unit test; pending P3 refactor
      'dune/tests/combat.test.js',       // pure parser unit test; pending P3 refactor
      'magic/util/CardFilter.test.js',   // pure utility test; loads card DB from disk
    ],
    rules: {
      // Codebase is CommonJS, so no-restricted-imports (which only catches ES `import`)
      // doesn't help. Match `require('...')` calls via esquery instead.
      'no-restricted-syntax': ['error',
        {
          selector: "CallExpression[callee.name='require'][arguments.0.value=/(\\/|^)(systems|phases|mixins)\\//]",
          message: 'Tests must drive the game via testutil + game.run()/choose()/action(). Do not require internal modules (systems/phases/mixins).',
        },
        {
          selector: "CallExpression[callee.name='require'][arguments.0.value=/^(fs|fs\\/.*|path)$/]",
          message: 'Tests should not read source files. Use inline fixtures or expose a loader through testutil.',
        },
      ],
    },
  },
])

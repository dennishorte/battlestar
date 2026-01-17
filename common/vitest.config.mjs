import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.test.js', '**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/coverage/**'],
    coverage: {
      provider: 'v8',
      include: ['**/*.js'],
      exclude: ['**/node_modules/**', '**/*.test.js', '**/testutil.js', '**/test_common.js']
    }
  }
})


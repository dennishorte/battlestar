import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/vitest.setup.js'],
    include: ['tests/**/*.test.js', 'tests/vitest.sample.test.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['/node_modules/']
    },
    alias: {
      '#': resolve(__dirname, './src')
    }
  }
}); 
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import path from 'path'

const commonPath = path.resolve(__dirname, '../common')

function restartOnCommonChange() {
  return {
    name: 'watch-common',
    configureServer(server) {
      server.watcher.add(commonPath)
      server.watcher.on('change', (file) => {
        if (file.startsWith(commonPath)) {
          server.restart()
        }
      })
    },
  }
}

export default defineConfig({
  optimizeDeps: {
    include: ['battlestar-common'],
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          whitespace: 'preserve',
        },
      },
    }),
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
    restartOnCommonChange(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_variables.scss" as *;`,
      },
    },
  },
  build: {
    commonjsOptions: {
      include: [/common/, /node_modules/],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

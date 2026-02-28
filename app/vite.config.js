import { defineConfig, loadEnv } from 'vite'
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  const appPort = parseInt(env.VITE_PORT) || 5173
  const apiPort = parseInt(env.VITE_API_PORT) || 3000

  return {
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
      port: appPort,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})

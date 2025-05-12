const { BootstrapVueNextResolver } = require('bootstrap-vue-next')

module.exports = {
  configureWebpack: {
    resolve: {
      symlinks: false
    },
    plugins: [
      require('unplugin-vue-components/webpack').default({
        resolvers: [ BootstrapVueNextResolver() ],
      }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@use "@/styles/_variables.scss" as *;`
      }
    }
  },
  devServer: {
    host: 'localhost',
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
    }
  },
  runtimeCompiler: true,
}

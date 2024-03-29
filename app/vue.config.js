module.exports = {
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/_variables.scss";`
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

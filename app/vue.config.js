module.exports = {
  devServer: {
    host: 'localhost',
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
    }
  }
}

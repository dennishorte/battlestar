const path = require('path')

module.exports = {
  entry: './server.js',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'server.bundle.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#/controllers': path.resolve(__dirname, 'src/controllers'),
      '#/models': path.resolve(__dirname, 'src/models'),
      '#/utils': path.resolve(__dirname, 'src/utils'),
      '#/services': path.resolve(__dirname, 'src/services'),
      '#/middleware': path.resolve(__dirname, 'src/middleware'),
      '#/routes': path.resolve(__dirname, 'src/routes')
    }
  }
}

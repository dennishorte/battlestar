const path = require('path')

module.exports = {
  entry: './src/server.js',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'server.bundle.js'
  },
  resolve: {
    alias: {
      '#': path.resolve(__dirname, 'src'),
    }
  }
}

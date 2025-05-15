import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
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
  },
  experiments: {
    outputModule: true
  }
}

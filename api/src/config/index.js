import developmentConfig from './development.js'
import productionConfig from './production.js'
import testConfig from './test.js'

const env = process.env.NODE_ENV || 'development'

const configs = {
  development: developmentConfig,
  production: productionConfig,
  test: testConfig
}

export default configs[env]

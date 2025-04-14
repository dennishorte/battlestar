const env = process.env.NODE_ENV || 'development'

const configs = {
  development: require('./development'),
  production: require('./production'),
  test: require('./test')
}

module.exports = configs[env] 
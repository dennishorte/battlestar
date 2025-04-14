module.exports = {
  port: 3001,
  db: {
    uri: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/game-center-test'
  },
  jwt: {
    secret: 'test-secret',
    expiresIn: '1h'
  },
  logLevel: 'error'
} 
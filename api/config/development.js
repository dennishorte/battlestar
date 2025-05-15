export default {
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/game-center',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '7d'
  },
  logLevel: 'debug'
}

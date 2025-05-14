module.exports = {
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
  },
  logLevel: 'info'
}

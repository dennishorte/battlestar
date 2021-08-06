require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const passport = require('passport')


const port = 3000


const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const db = require('./src/models/db.js')
const routes = require('./src/routes.js')
const app = express()


// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
var jwtOpts = {}
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOpts.secretOrKey = process.env.SECRET_KEY
passport.use(new JwtStrategy(
  jwtOpts,
  async function(tokenData, cb) {
    const id = tokenData.user_id
    const user = await db.user.findById(id)

    if (!user) { return cb(null, false) }
    return cb(null, user)
  }
))


////////////////////////////////////////////////////////////
// Middleware


/*
   By default, all routes require authentication.
   Routes that start with '/api/guest/' do not require authentication.
 */
app.use((req, res, next)  => {
  if (req.path.startsWith('/api/guest/') || req.path == '/') {
    next()
  }
  else {
    passport.authenticate('jwt', { session: false })(req, res, next)
  }
})
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../app/dist')))


////////////////////////////////////////////////////////////
// Routes

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../app/build/index.html'))
})


app.post('/api/guest/login', routes.login)


app.get('/api/users', async (req, res) => {
  const users = await db.user.all()
  res.json(users)
})


////////////////////////////////////////////////////////////
// Initialize

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`)
})

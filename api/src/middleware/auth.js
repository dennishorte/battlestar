import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { ObjectId } from 'mongodb'
import db from '#/models/db.js'

// Configure the Bearer strategy for use by Passport.
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  },
  async function(tokenData, cb) {
    const id = new ObjectId(tokenData.user_id)
    const user = await db.user.findById(id)

    if (!user) {
      return cb(null, false)
    }
    return cb(null, user)
  }
))

/*
   By default, all routes require authentication.
   Routes that start with '/api/guest/' do not require authentication.
 */
function authenticate(req, res, next) {
  if (req.path.startsWith('/api/guest/') || req.method === 'GET') {
    next()
  }
  else {
    passport.authenticate('jwt', { session: false })(req, res, next)
  }
}

export { authenticate }
export default { authenticate }

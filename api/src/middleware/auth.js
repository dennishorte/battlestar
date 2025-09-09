import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { ObjectId } from 'mongodb'
import db from '../models/db.js'

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

    // Check if this is an impersonation token
    if (tokenData.impersonation) {
      // Verify the impersonation is still active
      const impersonationStatus = await db.user.getImpersonationStatus(user._id)
      if (!impersonationStatus || !impersonationStatus.isImpersonated) {
        return cb(null, false)
      }

      // Add impersonation metadata to the user object
      user._impersonation = {
        isImpersonated: true,
        adminId: tokenData.admin_id,
        impersonationToken: true
      }
    }

    return cb(null, user)
  }
))

/*
   By default, all routes require authentication.
   Routes that start with '/api/guest/' do not require authentication.
 */
function authenticate(req, res, next) {
  if (req.path.startsWith('/api/guest/')) {
    next()
  }
  else if (req.method === 'GET' && !req.path.startsWith('/api/admin/')) {
    // Skip authentication for non-admin GET requests
    next()
  }
  else {
    passport.authenticate('jwt', { session: false })(req, res, next)
  }
}

export { authenticate }
export default { authenticate }

import db from '../models/db.js'
import magicRoutes from './api/magic/index.js'

// Note: These routes have been migrated to the new router system in src/routes/api
// Only keeping this file for backward compatibility with any components that might still reference it
const routes = {
  // Magic routes have been migrated to the new router architecture
  // Keeping references for backward compatibility
  magic: magicRoutes,
}

async function _createFirstUserIfNone(name, password) {
  if (await db.user.isEmpty()) {
    console.log('User db is empty. Creating first user.')
    await db.user.create({
      name,
      password,
      slack: null,
    })
  }
}

export async function login(req, res) {
  await _createFirstUserIfNone(req.body.user.name, req.body.user.password)
  const user = await db.user.checkPassword(req.body.user.name, req.body.user.password)

  if (!user) {
    res.json({
      status: 'error',
      message: 'User not found',
    })
  }
  else if (user.deactivated) {
    res.json({
      status: 'error',
      message: `User (${req.body.name}) has been deactivated`,
    })
  }
  else {
    res.json({
      status: 'success',
      user: {
        _id: user._id,
        name: user.name,
        token: user.token,
      },
    })
  }
}

export default routes

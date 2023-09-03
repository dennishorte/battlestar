const db = require('../models/db.js')
const path = require('path')
const slack = require('../util/slack.js')


module.exports = {
  magic: require('./magic'),

  lobby: require('./lobby_routes.js'),
  misc: require('./misc_routes.js'),
  game: require('./game_routes.js'),
  snapshot: require('./snapshot_routes.js'),
  user: require('./user_routes.js'),
}

async function _createFirstUserIfNone(name, password) {
  if (await db.user.isEmpty()) {
    console.log('User db is empty. Creating first user.')
    const user = await db.user.create({
      name,
      password,
      slack: null,
    })
  }
}

module.exports.login = async function(req, res) {
  await _createFirstUserIfNone(req.body.name, req.body.password)
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

const db = require('../models/db.js')
const path = require('path')
const slack = require('../util/slack.js')


module.exports = {
  card: require('./card_routes.js'),
  deck: require('./deck_routes.js'),
  lobby: require('./lobby_routes.js'),
  game: require('./game_routes.js'),
  scryfall: require('./scryfall_routes.js'),
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

module.exports.slackTest = async function(req, res) {
  const slackRes = await slack.test()
  res.json(slackRes)
}

module.exports.login = async function(req, res) {
  await _createFirstUserIfNone(req.body.name, req.body.password)
  const user = await db.user.checkPassword(req.body.name, req.body.password)

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

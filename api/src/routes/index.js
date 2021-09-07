const db = require('../models/db.js')


module.exports = {
  lobby: require('./lobby_routes.js'),
  game: require('./game_routes.js'),
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

module.exports.sendVueApp = function(req, res) {
  res.sendFile(path.join(__dirname, '../app/build/index.html'))
}

module.exports.login = async function(req, res) {
  await _createFirstUserIfNone(req.body.name, req.body.password)
  const user = await db.user.checkPassword(req.body.name, req.body.password)

  if (user.deactivated) {
    res.json({
      status: 'error',
      message: `User (${req.body.name}) has been deactivated`,
    })
    return
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
    return
  }
}

const db = require('./models/db.js')

module.exports = {
  lobby: {},
  user: {}
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
      token: user.token,
    })
    return
  }
}

module.exports.lobby.all = async function(req, res) {
  const lobbiesCursor = await db.lobby.all()
  const lobbiesArray = await lobbiesCursor.toArray()
  res.json({
    status: 'success',
    lobbies: lobbiesArray,
  })
}

module.exports.lobby.create = async function(req, res) {
  const lobbyId = await db.lobby.create()

  if (!lobbyId) {
    res.json({
      status: 'error',
      message: 'Failed to create new lobby',
    })
    return
  }

  const addResult = await db.lobby.addUser(lobbyId, req.user._id)

  if (!addResult) {
    res.json({
      status: 'error',
      message: `New lobby ${lobbyId} created, but error adding user to lobby.`,
    })
  }

  res.json({
    status: 'success',
    lobbyId,
  })
}


module.exports.lobby.info = async function(req, res) {
  const lobby = await db.lobby.findById(req.body.id)

  if (!lobby) {
    res.json({
      status: 'error',
      message: `Lobby with id ${req.body.id} not found`,
    })
    return
  }

  res.json({
    status: 'success',
    lobby,
  })
}


module.exports.user.all = async function(req, res) {
  const users = await db.user.all()
  res.json({
    status: 'success',
    users
  })
}

module.exports.user.create = async function(req, res) {
  const user = await db.user.create({
    name: req.body.name,
    password: req.body.password,
    slack: req.body.slack,
  })

  res.json({
    status: 'success',
    message: 'User created',
  })
}

module.exports.user.deactivate = async function(req, res) {
  const result = await db.user.deactivate(req.body.id)

  if (result.modifiedCount == 1) {
    res.json({ status: 'success' })
  }
  else {
    res.json({
      status: 'error',
      message: 'User not deactivated',
    })
  }
}

module.exports.user.fetchMany = async function(req, res) {
  const usersCursor = await db.user.findByIds(req.body.userIds)
  const usersArray = await usersCursor.toArray()

  res.json({
    status: 'success',
    users: usersArray,
  })
}

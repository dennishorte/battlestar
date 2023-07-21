const db = require('../models/db.js')

const Lobby = {}

Lobby.all = async function(req, res) {
  const lobbiesCursor = await db.lobby.all()
  const lobbiesArray = await lobbiesCursor.toArray()
  res.json({
    status: 'success',
    lobbies: lobbiesArray,
  })
}

Lobby.create = async function(req, res) {
  const user = await db.user.findById(req.user._id)

  if (!user) {
    res.json({
      status: 'error',
      message: 'Invalid user for lobby creation: ' + req.user._id,
    })
    return
  }

  const lobbyId = await db.lobby.create()

  if (!lobbyId) {
    res.json({
      status: 'error',
      message: 'Failed to create new lobby',
    })
    return
  }

  const lobby = await db.lobby.findById(lobbyId)
  const userIds = req.body.userIds || [user._id]
  const userCursor = await db.user.findByIds(userIds)
  const users = await userCursor.toArray()

  lobby.users = users.map(user => ({
    _id: user._id,
    name: user.name,
  }))

  if (req.body.game) {
    lobby.game = req.body.game
  }

  if (req.body.options) {
    lobby.options = req.body.options
  }

  await db.lobby.save(lobby)

  res.json({
    status: 'success',
    lobbyId,
  })
}

Lobby.info = async function(req, res) {
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

Lobby.kill = async function(req, res) {
  await db.lobby.kill(req.body.id)
  res.json({
    status: 'success',
  })
}

Lobby.save = async function(req, res) {
  await db.lobby.save(req.body)
  res.json({
    status: 'success',
  })
}

module.exports = Lobby

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
  const lobbyId = await db.lobby.create()

  if (!lobbyId) {
    res.json({
      status: 'error',
      message: 'Failed to create new lobby',
    })
    return
  }

  const addResult = await _addUsers(lobbyId, [req.user._id])

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

Lobby.nameUpdate = async function(req, res) {
  const updateResult = await db.lobby.nameUpdate(
    req.body.lobbyId,
    req.body.name,
  )
  res.json({
    status: 'success',
    message: 'Name updated',
  })
}

Lobby.playerAdd = async function(req, res) {
  await _addUsers(req.body.lobbyId, req.body.userIds)
  res.json({
    status: 'success',
    message: 'Users successfully added.',
  })
}

Lobby.playerRemove = async function(req, res) {
  const removeResult = await db.lobby.removeUsers(req.body.lobbyId, req.body.userIds)
  res.json({
    status: 'success',
    message: 'Users successfully removed.',
  })
}

Lobby.settingsUpdate = async function(req, res) {
  const updateResult = await db.lobby.updateSettings(
    req.body.lobbyId,
    req.body.game,
    req.body.options,
  )
  res.json({
    status: 'success',
    message: 'Settings updated',
  })
}

module.exports = Lobby


async function _addUsers(lobbyId, userIds) {
  const usersCursor = await db.user.findByIds(userIds)
  const users = await usersCursor.toArray()
  const userData = users.map(user => ({
    _id: user._id,
    name: user.name,
  }))

  return await db.lobby.addUsers(lobbyId, userData)
}

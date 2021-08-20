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

  const addResult = await db.lobby.addUsers(lobbyId, [req.user._id])

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

Lobby.playerAdd = async function(req, res) {
  const addResult = await db.lobby.addUsers(req.body.lobbyId, req.body.userIds)
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
  const updateResult = await db.lobby.updateSettings(req.body.lobbyId, req.body.settings)
  console.log({ updateResult })
  res.json({
    status: 'success',
    message: 'Settings updated',
  })
}

module.exports = Lobby

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

module.exports = Lobby

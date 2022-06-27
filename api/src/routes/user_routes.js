const db = require('../models/db.js')

const User = {}

User.all = async function(req, res) {
  const users = await db.user.all()
  res.json({
    status: 'success',
    users
  })
}

User.create = async function(req, res) {
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

User.deactivate = async function(req, res) {
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

User.fetchMany = async function(req, res) {
  const usersCursor = await db.user.findByIds(req.body.userIds)
  const usersArray = await usersCursor.toArray()

  res.json({
    status: 'success',
    users: usersArray,
  })
}

User.lobbies = async function(req, res) {
  const lobbyCursor = await db.lobby.findByUserId(req.body.userId)
  const lobbyArray = await lobbyCursor.toArray()

  res.json({
    status: 'success',
    lobbies: lobbyArray,
  })
}

User.games = async function(req, res) {
  const gameCursor = await db.game.findByUserId(req.body.userId)
  const gameArray = await gameCursor.toArray()

  res.json({
    status: 'success',
    games: gameArray,
  })
}

User.next = async function(req, res) {
  const gameCursor = await db.game.findByUserId(req.body.userId)
  const gameArray = await gameCursor.toArray()
  const gameIds = gameArray.map(game => game._id)

  let nextId

  if (gameIds.length === 0) {
    nextId = undefined
  }
  else if (req.body.gameId) {
    const index = gameIds.indexOf(req.body.gameId)
    if (index >= 0) {
      const nextIndex = (index + 1) % gameIds.length
      nextId = gameIds[nextIndex]
    }
    else {
      nextId = gameIds[0]
    }
  }
  else {
    nextId = gameIds[0]
  }

  res.json({
    status: 'success',
    gameId: nextId
  })
}

User.update = async function(req, res) {
  await db.user.update(req.body)
  res.json({
    status: 'success',
    message: 'User updated',
  })
}

module.exports = User

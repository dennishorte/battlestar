const db = require('../models/db.js')

const User = {
  magic: {},
}

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

User.gamesRecentlyFinished = async function(req, res) {
  const gameCursor = await db.game.findRecentlyFinishedByUserId(req.body.userId)
  const gameArray = await gameCursor.toArray()

  res.json({
    status: 'success',
    games: gameArray,
  })
}

User.next = async function(req, res) {
  const user = await db.user.findById(req.body.userId)
  const userName = user.name
  const gameCursor = await db.game.findByUserId(req.body.userId)
  const gameArray = await gameCursor.toArray()

  if (req.body.gameId) {
    for (let i = 0; i < gameArray.length; i++) {
      if (!gameArray[gameArray.length - 1]._id.equals(req.body.gameId)) {
        gameArray.push(gameArray.shift())
      }
      else {
        break
      }
    }
  }

  const gameIds = gameArray
    .filter(game => !!game.waiting)
    .filter(game => game.waiting.includes(userName))
    .map(game => game._id)

  const nextId = gameIds.length > 0 ? gameIds[0] : undefined

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



User.magic.decks = async function(req, res) {
  const decks = await db.magic.deck.findByUserId(req.body.userId)

  res.json({
    status: 'success',
    decks,
  })
}

User.magic.files = async function(req, res) {
  const files = [
    await db.magic.deck.findByUserId(req.body.userId),
    await db.magic.cube.findByUserId(req.body.userId),
  ].flat()

  res.json({
    status: 'success',
    files,
  })
}

module.exports = User

require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const history = require('connect-history-api-fallback')
const path = require('path')

const middleware = require('./src/middleware.js')
const routes = require('./src/routes')

const app = express()
const port = 3000


////////////////////////////////////////////////////////////
// Middleware

app.use(history({ index: '/' }))
app.use(express.static(path.join(__dirname, '../app/dist')))
app.use(middleware.authenticate)
app.use(bodyParser.json({ limit: "500kb" }))
app.use(middleware.coerceIds)


////////////////////////////////////////////////////////////
// Routes

// Card routes
app.post('/api/magic/card/all', routes.magic.card.fetchAll)

// Cube routes
app.post('/api/magic/cube/create', routes.magic.cube.create)
app.post('/api/magic/cube/fetch', routes.magic.cube.fetch)
app.post('/api/magic/cube/save', routes.magic.cube.save)

// Deck routes
app.post('/api/magic/deck/create', routes.magic.deck.create)
app.post('/api/magic/deck/save', routes.magic.deck.save)

// File routes
app.post('/api/magic/file/delete', routes.magic.file.delete)
app.post('/api/magic/file/update', routes.magic.file.update)

// Scryfall Routes
app.post('/api/magic/scryfall/update', routes.magic.scryfall.updateAll)


////////////////////////////////////////

// Guest routes
app.post('/api/guest/slack_test', routes.slackTest)
app.post('/api/guest/login', routes.login)

// Lobby Routes
app.post('/api/lobby/all', routes.lobby.all)
app.post('/api/lobby/create', routes.lobby.create)
app.post('/api/lobby/info', routes.lobby.info)
app.post('/api/lobby/kill', routes.lobby.kill)
app.post('/api/lobby/save', routes.lobby.save)

// Game Routes
app.post('/api/game/create', routes.game.create)
app.post('/api/game/fetch', routes.game.fetch)
app.post('/api/game/fetchAll', routes.game.fetchAll)
app.post('/api/game/kill', routes.game.kill)
app.post('/api/game/saveFull', routes.game.saveFull)
app.post('/api/game/updateStats', routes.game.updateStats)

// Snapshot Routes
app.post('/api/snapshot/create', routes.snapshot.create)
app.post('/api/snapshot/fetch', routes.snapshot.fetch)

// User Routes
app.post('/api/user/all', routes.user.all)
app.post('/api/user/create', routes.user.create)
app.post('/api/user/deactivate', routes.user.deactivate)
app.post('/api/user/fetch_many', routes.user.fetchMany)
app.post('/api/user/games', routes.user.games)
app.post('/api/user/games_recently_finished', routes.user.gamesRecentlyFinished)
app.post('/api/user/lobbies', routes.user.lobbies)
app.post('/api/user/magic/decks', routes.user.magic.decks)
app.post('/api/user/magic/files', routes.user.magic.files)
app.post('/api/user/next', routes.user.next)
app.post('/api/user/update', routes.user.update)


////////////////////////////////////////////////////////////
// Initialize

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`)
})

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

// Guest routes
app.post('/api/guest/slack_test', routes.slackTest)
app.post('/api/guest/login', routes.login)

// Lobby Routes
app.post('/api/lobby/all', routes.lobby.all)
app.post('/api/lobby/create', routes.lobby.create)
app.post('/api/lobby/info', routes.lobby.info)
app.post('/api/lobby/name_update', routes.lobby.nameUpdate)
app.post('/api/lobby/player_add', routes.lobby.playerAdd)
app.post('/api/lobby/player_remove', routes.lobby.playerRemove)
app.post('/api/lobby/settings_update', routes.lobby.settingsUpdate)

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
app.post('/api/user/next', routes.user.next)
app.post('/api/user/update', routes.user.update)


////////////////////////////////////////////////////////////
// Initialize

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`)
})

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
app.use(middleware.ensureVersion)
app.use(middleware.coerceIds)


////////////////////////////////////////////////////////////
// Magic Routes

// Achievement routes
app.post('/api/magic/achievement/all', routes.magic.achievement.fetchAll)
app.post('/api/magic/achievement/claim', routes.magic.achievement.claim)
app.post('/api/magic/achievement/delete', routes.magic.achievement.delete)
app.post('/api/magic/achievement/linkFilters', routes.magic.achievement.linkFilters)
app.post('/api/magic/achievement/save', routes.magic.achievement.save)

// Card routes
app.post('/api/magic/card/all', routes.magic.card.fetchAll)
app.post('/api/magic/card/save', routes.magic.card.save)
app.post('/api/magic/card/versions', routes.magic.card.versions)

// Cube routes
app.post('/api/magic/cube/create', routes.magic.cube.create)
app.post('/api/magic/cube/fetch', routes.magic.cube.fetch)
app.post('/api/magic/cube/fetchPublic', routes.magic.cube.fetchPublic)
app.post('/api/magic/cube/save', routes.magic.cube.save)
app.post('/api/magic/cube/toggleEdits', routes.magic.cube.toggleEdits)
app.post('/api/magic/cube/togglePublic', routes.magic.cube.togglePublic)

// Deck routes
app.post('/api/magic/deck/add_card', routes.magic.deck.addCard)
app.post('/api/magic/deck/create', routes.magic.deck.create)
app.post('/api/magic/deck/fetch', routes.magic.deck.fetch)
app.post('/api/magic/deck/save', routes.magic.deck.save)

// File routes
app.post('/api/magic/file/create', routes.magic.file.create)
app.post('/api/magic/file/delete', routes.magic.file.delete)
app.post('/api/magic/file/duplicate', routes.magic.file.duplicate)
app.post('/api/magic/file/save', routes.magic.file.save)

// Link routes
app.post('/api/magic/link/create', routes.magic.link.create)
app.post('/api/magic/link/fetchDrafts', routes.magic.link.fetchDrafts)
app.post('/api/magic/link/fetchByDraft', routes.magic.link.fetchByDraft)

// Scar routes
app.post('/api/magic/scar/apply', routes.magic.scar.apply)
app.post('/api/magic/scar/fetchAll', routes.magic.scar.fetchAll)
app.post('/api/magic/scar/fetchAvailable', routes.magic.scar.fetchAvailable)
app.post('/api/magic/scar/save', routes.magic.scar.save)
app.post('/api/magic/scar/releaseByUser', routes.magic.scar.releaseByUser)

// Scryfall Routes
app.post('/api/magic/scryfall/update', routes.magic.scryfall.updateAll)


////////////////////////////////////////////////////////////
// Tyrants

app.post('/api/tyrants/hex/all', routes.tyrants.hex.all)
app.post('/api/tyrants/hex/delete', routes.tyrants.hex.delete)
app.post('/api/tyrants/hex/save', routes.tyrants.hex.save)

////////////////////////////////////////////////////////////

// Guest routes
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
app.post('/api/game/rematch', routes.game.rematch)
app.post('/api/game/saveFull', routes.game.saveFull)
app.post('/api/game/saveResponse', routes.game.saveResponse)
app.post('/api/game/stats/innovation', routes.game.stats.innovation)
app.post('/api/game/undo', routes.game.undo)

// Misc Routes
app.post('/api/appVersion', routes.misc.appVersion)

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
app.post('/api/user/magic/cubes', routes.user.magic.cubes)
app.post('/api/user/magic/decks', routes.user.magic.decks)
app.post('/api/user/magic/files', routes.user.magic.files)
app.post('/api/user/next', routes.user.next)
app.post('/api/user/update', routes.user.update)


////////////////////////////////////////////////////////////
// Initialize

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`)
})

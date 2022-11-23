const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const cardUtil = require('./cardUtil.js')
const deckUtil = require('./deckUtil.js')
const res = require('./data.js')
const util = require('../lib/util.js')
const Zone = require('./Zone.js')


module.exports = {
  GameOverEvent,
  Magic,
  MagicFactory,
  factory: factoryFromLobby,
  res,
}

function Magic(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookup = null
}

util.inherit(Game, Magic)

function MagicFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Magic(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Magic',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Magic.prototype._mainProgram = function() {
  this.initialize()
  this.chooseDecks()

}

Magic.prototype._gameOver = function() {
  throw new Error('_gameOver is not used in Magic games')
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

Magic.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.initializePlayers()
  this.initializeZones()
  this.initializeStartingPlayer()

  this.mLogOutdent()
  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Magic.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => ({
    _id: p._id,
    id: p.name,
    name: p.name,
    team: p.name,
  }))
  util.array.shuffle(this.state.players, this.random)
  this.state.players.forEach((player, index) => {
    player.index = index
  })
  this.mLog({ template: 'Randomizing player seating' })
}

Magic.prototype.initializeZones = function() {
  this.state.zones = {}
  this.state.zones.players = {}
  this.state.zones.stack = new Zone(this, 'stack', 'public')

  for (const player of this.getPlayerAll()) {
    this.state.zones.players[player.name] = {
      // Private zones
      hand: new Zone(this, 'hand', 'private'),
      library: new Zone(this, 'library', 'private'),
      sideboard: new Zone(this, 'sideboard', 'private'),

      // Public zones
      battlefield: new Zone(this, 'battlefield', 'public'),
      command: new Zone(this, 'command', 'public'),
      creatures: new Zone(this, 'creatures', 'public'),
      graveyard: new Zone(this, 'graveyard', 'public'),
      exile: new Zone(this, 'exile', 'public'),
      land: new Zone(this, 'land', 'public'),
    }
  }
}

Magic.prototype.initializeStartingPlayer = function() {
  const player = this.getPlayerByName(this.settings.startingPlayerName)
  if (player) {
    this.mLog({
      template: '{player} was selected to go first',
      args: { player }
    })
    this.currentPlayer = player
  }
  else {
    const randomPlayer = util.array.select(this.getPlayerAll(), this.random)
    this.mLog({
      template: 'Randomly selected {player} to go first',
      args: { player: randomPlayer }
    })
    this.currentPlayer = randomPlayer
  }
}


////////////////////////////////////////////////////////////////////////////////
// Game Phases

Magic.prototype.chooseDecks = function() {
  this.mLog({ template: 'Choosing starting decks' })
  this.mLogIndent()

  const requests = this
    .getPlayerAll()
    .map(player => ({
      actor: this.utilSerializeObject(player),
      title: 'Choose Deck',
      choices: '__UNSPECIFIED__',
    }))

  const responses = this.requestInputMany(requests)

  for (const response of responses) {
    const player = this.getPlayerByName(response.actor)
    this.setDeck(player, response.deckData)
  }

  this.mLogOutdent()
}


////////////////////////////////////////////////////////////////////////////////
// Setters, getters, actions, etc.

Magic.prototype.setDeck = function(player, data) {
  this.mLog({
    template: '{player} has selected a deck',
    args: { player },
  })

  player.deck = deckUtil.deserialize(data)
  cardUtil.lookup.insertCardData(player.deck.cardlist, this.cardLookup)

  const zones = util.array.collect(player.deck.cardlist, card => card.zone)

  if (!zones.main) {
    throw new Error('No cards in maindeck for deck: ' + player.deck.name)
  }

  const library = this.getZoneByPlayer(player, 'library')
  for (const card of zones.main) {
    library.addCard(card)
  }
  library.shuffle()

  if (zones.side) {
    const sideboard = this.getZoneByPlayer(player, 'sideboard')
    for (const card of zones.side) {
      sideboard.addCard(card)
    }
  }

  if (zones.command) {
    const command = this.getZoneByPlayer(player, 'command')
    for (const card of zones.command) {
      command.addCard(card)
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Utility functions

Magic.prototype.utilSerializeObject = function(obj) {
  if (typeof obj === 'object') {
    util.assert(obj.id !== undefined, 'Object has no id. Cannot serialize.')
    return obj.id
  }
  else if (typeof obj === 'string') {
    return obj
  }
  else {
    throw new Error(`Cannot serialize element of type ${typeof obj}`)
  }
}

Magic.prototype._enrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    if (key === 'players') {
      const players = msg.args[key]
      msg.args[key] = {
        value: players.map(p => p.name || p).join(', '),
        classes: ['player-names'],
      }
    }
    else if (key.startsWith('player')) {
      const player = msg.args[key]
      msg.args[key] = {
        value: player.name || player,
        classes: ['player-name']
      }
    }
    else if (key.startsWith('card')) {
      const card = msg.args[key]
      msg.args[key] = {
        value: card.id,
        classes: ['card-id'],
      }
    }
    else if (key.startsWith('zone')) {
      const zone = msg.args[key]
      msg.args[key] = {
        value: zone.name,
        classes: ['zone-name']
      }
    }
    // Convert string args to a dict
    else if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }
  }
}

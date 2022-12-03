const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const util = require('../lib/util.js')


module.exports = {
  GameOverEvent,
  Winston,
  WinstonFactory,
  factory: factoryFromLobby,
}

function Winston(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookup = null
  this.cardsById = {}
}

util.inherit(Game, Winston)


function WinstonFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Winston(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Winstong Draft',
    name: lobby.name,
    rounds: lobby.rounds,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Winston.prototype._mainProgram = function() {
  this.initialize()
  this.mainloop()
}

Winston.prototype._gameOver = function(event) {
  this.mLogSetIndent(0)
  this.mLog({
    template: 'Draft complete',
    args: {
      player: 'Everyone',
      reason: 'drafts are fun',
    }
  })
  return event
}


////////////////////////////////////////////////////////////////////////////////
// Initialization


Winston.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.initializePlayers()
  this.initializeZones()
  this.initializeCards()

  this.state.round = 0

  this.mLogOutdent()
}

Winston.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => {
    ...p,
    cards: [],
  })
  util.array.shuffle(this.state.players, this.random)
  this.state.players.forEach((player, index) => {
    player.index = index
  })
  this.mLog({ template: 'Randomizing player seating' })
}

Winston.prototype.initializeZones = function() {
  this.state.zones = {}
  this.state.zones.deck = new Zone(this, 'deck', 'hidden')
  this.state.zones.pileA = new Zone(this, 'pile a', 'hidden')
  this.state.zones.pileB = new Zone(this, 'pile b', 'hidden')
  this.state.zones.pileC = new Zone(this, 'pile c', 'hidden')

  this.state.zones.players = {}
  for (const player of this.getPlayerAll()) {
    this.state.zones.players[player.name] = {}
    this.state.zones.players[player.name].picks = new PlayerZone(this, player, 'picks', 'private')
  }
}

Winston.prototype.initializeCards = function(data) {
  const cards = data
    .packs
    .flatMap(p => p.cards)

  for (const card of cards) {
    this.state.zones.deck.addCard(card)
  }
  this.state.zones.deck.shuffle()
  this.mRefillZones()
}


////////////////////////////////////////////////////////////////////////////////
// Main

Winston.prototype.mainloop = function() {
  for (const round in rounds) {
    this.executeRound()
  }
}

Winston.prototype.

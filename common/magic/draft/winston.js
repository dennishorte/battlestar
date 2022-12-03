const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const util = require('../lib/util.js')


module.exports = {
  GameOverEvent,
  MagicDraft,
  MagicDraftFactory,
  factory: factoryFromLobby,
}

function MagicDraft(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookup = null
  this.cardsById = {}
}

util.inherit(Game, MagicDraft)


function MagicDraftFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new MagicDraft(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Magic Draft',
    name: lobby.name,
    rounds: lobby.rounds,
    players: lobby.users,
    seed: lobby.seed,
  })
}

MagicDraft.prototype._mainProgram = function() {
  this.initialize()
  this.mainloop()
}

MagicDraft.prototype._gameOver = function(event) {
  this.mLogSetIndent(0)
  this.mLog({
    template: '{player} wins due to {reason}',
    args: {
      player: event.data.player,
      reason: event.data.reason,
    }
  })
  return event
}


////////////////////////////////////////////////////////////////////////////////
// Initialization


MagicDraft.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.initializePlayers()
  this.initializeRounds()

  this.state.round = 0

  this.mLogOutdent()
}

MagicDraft.prototype.initializePlayers = function() {
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

MagicDraft.prototype.initializeRounds = function() {
  for (const round of this.settings.rounds) {
    if (round.kind === 'winston') {
      this.state.rounds.push(this.initializeWinston(round))
    }
    else {
      throw new Error(`Unhandled draft round: ${round.kind}`)
    }
  }
}

MagicDraft.prototype.initializeWinston = function(data) {
  this.mLog({ template: 'Initializing Winston Draft' })

  this.state.zones.deck = new Zone(this, 'deck', 'hidden')
  this.state.zones.pileA = new Zone(this, 'pile a', 'hidden')
  this.state.zones.pileB = new Zone(this, 'pile b', 'hidden')
  this.state.zones.pileC = new Zone(this, 'pile c', 'hidden')

  this.state.zones.players = {}
  for (const player of this.getPlayerAll()) {
    this.state.zones.players[player.name] = {}
    this.state.zones.players[player.name].picks = new PlayerZone(this, player, 'picks', 'private')
  }

  const cards = data
    .packs
    .flatMap(p => p.cards)

  for (const card of cards) {
    this.state.zones.deck.addCard(card)
  }
  this.state.zones.deck.shuffle()
  this.winston.aRefillZones()
}


////////////////////////////////////////////////////////////////////////////////
// Main

MagicDraft.prototype.mainloop = function() {
  for (const round in rounds) {
    this.executeRound()
  }
}

MagicDraft.prototype.

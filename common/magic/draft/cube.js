const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../../lib/game.js')

const Pack = require('./pack.js')
const util = require('../../lib/util.js')

module.exports = {
  GameOverEvent,
  CubeDraft,
  CubeDraftFactory,
  factory: factoryFromLobby,
}

function CubeDraft(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookupFunc = null
  this.cardsById = {}
}

util.inherit(Game, CubeDraft)

function CubeDraftFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new CubeDraft(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'CubeDraft',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

CubeDraft.prototype._mainProgram = function() {
  this.initialize()
  this.mLog({ template: "Draft Begins" })
  this.mainLoop()
}

CubeDraft.prototype._gameOver = function(event) {
  this.mLogSetIndent(0)
  this.mLog({ template: 'Draft Complete' })
  return event
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

CubeDraft.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.initializePlayers()
  this.initializePacks()

  this.mLogOutdent()
  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

CubeDraft.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => ({
    _id: p._id,
    id: p.name,
    name: p.name,
    index: null,
    draftCompelete: false,
    waitingPacks: [],
    unopenedPacks: [],
  }))
  this.mLog({ template: 'Randomizing player seating' })
  util.array.shuffle(this.state.players, this.random)
  this.state.players.forEach((player, index) => {
    player.index = index
  })
}

CubeDraft.prototype.initializePacks = function() {
  this.state.packs = this.settings.packs.map(pack => new Pack(this, pack))

  let packIndex = 0

  for (const player of this.getPlayerAll()) {
    for (let p_i = 0; p_i < this.settings.numPacks; p_i++) {
      const pack = this.state.packs[packIndex]
      pack.index = p_i
      pack.owner = player
      player.unopenedPacks.push(pack)
      packIndex += 1
    }
  }

  // Open the first pack for each player.
  this
    .getPlayerAll()
    .forEach(player => this.aOpenNextPack(player))
}


////////////////////////////////////////////////////////////////////////////////
// Main

CubeDraft.prototype.mainLoop = function() {
  while (true) {
    const playerOptions = this
      .getPlayerAll()
      .filter(p => this.checkPlayerHasOption(p))
      .map(p => this.getPlayerOptions(p))
    const action = this.requestInputAny(playerOptions)

    console.log(action)
    break
  }
}

CubeDraft.prototype.aDraftCard = function(player, pack, card) {
  assert(this.getNextPackForPlayer(player) === pack, "This pack isn't ready for this player")
  assert(pack.checkContainsCard(card), "The selected card is not in the pack.")

  pack.picked.push(card)
  player.waitingPacks.shift() // remove this pack from the front of the player queue

  if (pack.checkIsEmpty()) {
    // Do not pass this pack to the next player.
    // Open the next pack if one is available.
    this.aOpenNextPack(player)
  }
  else {
    // Pass this pack to the next player.
    const nextPlayer = this.getPlayerNextForPack(pack)
    nextPlayer.waitingPacks.push(pack)
  }
}

CubeDraft.prototype.aOpenNextPack = function(player) {
  const pack = player.unopenedPacks.shift()
  if (pack) {

  }

  // Player has no remaining packs.
  // They are done unless some draft matters event happens that affects them.
  else {
    player.draftComplete = true
  }
}

CubeDraft.prototype.checkPlayerHasOption = function(player) {
  return this.getWaitingPacksForPlayer(player).length > 0
}

CubeDraft.prototype.getWaitingPacksForPlayer = function(player) {
  return player.waitingPacks
}

CubeDraft.prototype.getPacks = function() {
  return this.state.packs
}

CubeDraft.prototype.getPlayerOptions = function(player) {
  const pack = this.getWaitingPacksForPlayer(player)[0]
  if (pack) {
    return [{
      actor: this.player.name,
      title: 'Draft Card',
      choices: pack.getRemainingCards()
    }]
  }
  else {
    return []
  }
}

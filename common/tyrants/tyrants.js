const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('./../lib/game.js')
const Player = require('./Player.js')
const Zone = require('./Zone.js')
const res = require('./resources.js')
const util = require('../lib/util.js')


module.exports = {
  GameOverEvent,
  Tyrants,
  TyrantsFactory,
  factory: factoryFromLobby,
}


function Tyrants(serialized_data, viewerName) {
  Game.call(this, serialized_data)
  this.viewerName = viewerName
}

util.inherit(Game, Tyrants)

function TyrantsFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Tyrants(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Tyrants.prototype._mainProgram = function() {
  this.initialize()
  this.mainLoop()
}

Tyrants.prototype._gameOver = function(event) {
  this.mLog({
    template: '{player} wins due to {reason}',
    args: {
      player: event.data.player,
      reason: event.data.reason,
    }
  })
  this.gameOver = true
  return event
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

Tyrants.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.initializePlayers()
  this.initializeZones()
  this.initializeCards()
  this.initializeTokens()
  this.initializeStartingHands()

  this.mLogOutdent()

  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Tyrants.prototype.initializeZones = function() {
  this.state.zones = {}
  this.initializeMapZones()
  this.initializeMarketZones()
  this.initializePlayerZones()
  this.initializeTokenZones()
}

Tyrants.prototype.initializePlayers = function() {
  this.state.players = []

  for (const p of this.settings.players) {
    const player = new Player()
    player._id = p._id
    player.game = this
    player.name = p.name
    player.points = 0
    this.state.players.push(player)
  }
}

Tyrants.prototype.initializeMapZones = function() {
  this.state.zones.map = res.maps[this.settings.map]
}

Tyrants.prototype.initializeMarketZones = function() {
  this.state.zones.market = new Zone(this, 'market', 'public')
  this.state.zones.priestess = new Zone(this, 'priestess', 'public')
  this.state.zones.guard = new Zone(this, 'guard', 'public')
  this.state.zones.outcast = new Zone(this, 'outcast', 'public')
}

Tyrants.prototype.initializeTokenZones = function() {
  this.state.zones.neutral = new Zone(this, 'neutral', 'tokens')
}

Tyrants.prototype.initializePlayerZones = function() {
  this.state.zones.players = {}

  function _addPlayerZone(player, name, kind, root) {
    root[name] = new Zone(this, `players.${player.name}.${name}`, kind)
    root[name].owner = player.name
  }

  for (const player of this.getPlayerAll()) {
    const root = {}
    _addPlayerZone(player, 'deck', 'deck', root)
    _addPlayerZone(player, 'played', 'public', root)
    _addPlayerZone(player, 'discard', 'public', root)
    _addPlayerZone(player, 'hand', 'private', root)
    _addPlayerZone(player, 'innerCircle', 'private', root)

    _addPlayerZone(player, 'troops', 'tokens', root)
    _addPlayerZone(player, 'spies', 'tokens', root)

    this.state.zones.players[player.name] = root
  }
}

Tyrants.prototype.initializeCards = function() {
  this.state.zones.priestess = new Zone(this, 'priestess', 'open')
  this.state.zones.priestess.setCards(res.cards.byName['Priestess of Lloth'])

  this.state.zones.guard = new Zone(this, 'guard', 'open')
  this.state.zones.guard.setCards(res.cards.byName['House Guard'])

  // Market deck
  this.state.zones.marketDeck = new Zone(this, 'marketDeck', 'deck')
  this.state.zones.marketDeck.setCards(
    this
      .getExpansionList()
      .flatMap(exp => res.cards.byExpansion[exp])
  )
  this.mShuffle(this.getZoneById('marketDeck'))

  // Market cards
  this.mRefillMarket()

  // Starter decks
  let x = 0
  let y = 0
  for (const player of this.getPlayerAll()) {
    const hand = this.getZoneByPlayer(player, 'hand')
    for (let i = 0; i < 8; i++) {
      hand.addCard(res.cards.byName['Noble'][x])
      x += 1
    }

    for (let i = 0; i < 2; i++) {
      hand.addCard(res.cards.byName['Soldier'][y])
      y += 1
    }

    this.mShuffle(hand)
  }
}

Tyrants.prototype.initializeTokens = function() {
  // Player troops
  // Player spies
  // Neutrals
  // Place neutrals on map
}

Tyrants.prototype.initializeStartingHands = function() {
  for (const player of this.getPlayerAll()) {
    this.mRefillHand(player)
  }
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Tyrants.prototype.mainLoop = function() {
  /* while (true) {
   *   this.doActions()
   *   this.endOfTurn()
   *   this.cleanup()
   *   this.drawHand()
   * } */
}


////////////////////////////////////////////////////////////////////////////////
// Core Functionality

Tyrants.prototype.aPlayCard = function(player, card) {

}

Tyrants.prototype.aAssassinate = function(player, loc) {

}

Tyrants.prototype.aDeploy = function(player, loc) {

}

Tyrants.prototype.aDevour = function(player, card) {

}

Tyrants.prototype.aDraw = function(player) {
  const deck = this.getZoneByPlayer(player, 'deck')
  const hand = this.getZoneByPlayer(player, 'hand')

  if (deck.cards().length === 0) {
    // See if we can reshuffle.
    // If not, do nothing.
  }

  this.mLog({
    template: '{player} draws a card',
    args: { player }
  })
  this.mMoveByIndices(deck, 0, hand, hand.cards().length)
}

Tyrants.prototype.aMove = function(player, start, end) {

}

Tyrants.prototype.aPlaceSpy = function(player, loc) {

}

Tyrants.prototype.aPromote = function(player, card) {

}

Tyrants.prototype.aRecruit = function(player, card) {

}

Tyrants.prototype.aReturnSpy = function(player, loc, color) {

}

Tyrants.prototype.aReturnTroop = function(player, loc, color) {

}

Tyrants.prototype.aSupplant = function(player, loc, color) {

}

Tyrants.prototype.getExpansionList = function() {
  return this.settings.expansions
}

Tyrants.prototype.getPlayerAll = function() {
  return this.state.players
}

Tyrants.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(player => player.name === name)
}

Tyrants.prototype.getZoneById = function(id) {
  const tokens = id.split('.')
  let curr = this.state.zones
  for (const token of tokens) {
    util.assert(curr.hasOwnProperty(token), `Invalid zone id ${id} at token ${token}`)
    curr = curr[token]
  }
  return curr
}

Tyrants.prototype.getZoneByPlayer = function(player, name) {
  return this.state.zones.players[player.name][name]
}

Tyrants.prototype.mAdjustCardVisibility = function(card) {
  if (!this.state.initializationComplete) {
    return
  }

  const zone = this.getZoneByCard(card)

  // Forget everything about a card if it is returned.
  if (zone.kind === 'deck') {
    card.visibility = []
  }

  else if (zone.kind === 'public' || zone.kind === 'tokens') {
    card.visibility = this.getPlayerAll().map(p => p.name)
  }

  else if (zone.kind === 'private') {
    util.array.pushUnique(card.visibility, zone.owner)
  }

  else {
    throw new Error(`Unknown zone kind ${zone.kind} for zone ${zone.id}`)
  }
}

Tyrants.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)
  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target.id
  this.mAdjustCardVisibility(card)
  return card
}

Tyrants.prototype.mShuffle = function(zone) {
  util.array.shuffle(zone._cards, this.random)
}

Tyrants.prototype.mRefillHand = function(player) {
  const zone = this.getZoneByPlayer(player, 'hand')
  while (zone.cards().length < 5) {
    this.aDraw(player)
  }
}

Tyrants.prototype.mRefillMarket = function() {
  const deck = this.getZoneById('marketDeck')
  const market = this.getZoneById('market')
  const count = 6 - market.cards().length
  for (let i = 0; i < count; i++) {
    this.mMoveByIndices(deck, 0, market, market.cards().length)
  }
}

const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('./../lib/game.js')
const Player = require('./Player.js')
const Token = require('./Token.js')
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
  this.initializeStartingPlayer()
  this.initializeTransientState()

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
  this.state.zones.neutrals = new Zone(this, 'neutrals', 'tokens')
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
    _addPlayerZone(player, 'trophyHall', 'public', root)
    _addPlayerZone(player, 'hand', 'private', root)
    _addPlayerZone(player, 'innerCircle', 'private', root)

    _addPlayerZone(player, 'troops', 'tokens', root)
    _addPlayerZone(player, 'spies', 'tokens', root)

    this.state.zones.players[player.name] = root
  }
}

Tyrants.prototype.initializeCards = function() {
  this.state.zones.priestess = new Zone(this, 'priestess', 'open')
  this.state.zones.priestess.setCards(res.cards.byName['Priestess of Lolth'])

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
    const deck = this.getZoneByPlayer(player, 'deck')
    for (let i = 0; i < 8; i++) {
      const card = res.cards.byName['Noble'][x]
      card.zone = deck.id
      deck.addCard(card)
      x += 1
    }

    for (let i = 0; i < 2; i++) {
      const card = res.cards.byName['Soldier'][y]
      card.zone = deck.id
      deck.addCard(card)
      y += 1
    }

    this.mShuffle(deck)
  }
}

Tyrants.prototype.initializeTokens = function() {
  for (const player of this.getPlayerAll()) {
    const troopZone = this.getZoneByPlayer(player, 'troops')
    for (let i = 0; i < 40; i++) {
      const name = `troop-${player.name}`
      const token = new Token(name + '-' + i, name)
      token.isTroop = true
      token.zone = troopZone.id
      token.owner = player
      troopZone.addCard(token)
    }

    const spyZone = this.getZoneByPlayer(player, 'spies')
    for (let i = 0; i < 5; i++) {
      const name = `spy-${player.name}`
      const token = new Token(name + '-' + i, name)
      token.isSpy = true
      token.zone = spyZone.id
      token.owner = player
      spyZone.addCard(token)
    }
  }

  // Neutrals
  const neutralZone = this.getZoneById('neutrals')
  for (let i = 0; i < 40; i++) {
    const name = 'neutral'
    const token = new Token(name + '-' + i, name)
    token.isTroop = true
    token.zone = neutralZone.id
    neutralZone.addCard(token)
  }

  // Place neutrals on map
  for (const loc of this.getLocationAll()) {
    for (let i = 0; i < loc.neutrals; i++) {
      this.mMoveByIndices(neutralZone, 0, loc, loc.cards().length)
    }
  }
}

Tyrants.prototype.initializeStartingHands = function() {
  for (const player of this.getPlayerAll()) {
    this.mRefillHand(player)
  }
}

Tyrants.prototype.initializeStartingPlayer = function() {
  this.state.currentPlayer = this.getPlayerAll()[0]
}

Tyrants.prototype.initializeTransientState = function() {
  this.state.turn = 0
  this.state.endOfTurnActions = []
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Tyrants.prototype.mainLoop = function() {
  while (true) {
    this.mLog({
      template: '{player} turn {count}',
      args: {
        player: this.getPlayerCurrent(),
        count: this.getRound(),
      }
    })

    this.preActions()
    this.doActions()
    this.endOfTurn()
    this.cleanup()

    this.drawHand()
    this.nextPlayer()
  }
}

Tyrants.prototype.preActions = function() {
  // Gain influence from site control tokens.
}

Tyrants.prototype.doActions = function() {
  const player = this.getPlayerCurrent()

  while (true) {
    const chosenAction = this.requestInputSingle({
      actor: player.name,
      title: `Choose Action`,
      choices: this._generateActionChoices(),
    })

    if (chosenAction === 'Pass') {
      this.mLog({
        template: '{player} passes',
        args: { player }
      })
      break
    }

    const name = chosenAction.title
    const arg = chosenAction.selection[0]

    if (name === 'Play Card') {

    }
    else if (name === 'Recruit') {

    }
    else if (name === 'Use Power') {

    }
    else {
      throw new Error(`Unknown action: ${name}`)
    }
  }
}

Tyrants.prototype._generateActionChoices = function() {
  const choices = []
  choices.push(this._generateCardActions())
  choices.push(this._generateBuyActions())
  choices.push(this._generatePowerActions())
  choices.push(this._generatePassAction())
  return choices.filter(action => action !== undefined)
}

Tyrants.prototype._generateCardActions = function() {
  const choices = []
  for (const card of this.getCardsByZone(this.getPlayerCurrent(), 'hand')) {
    choices.push(card)
  }

  if (choices) {
    return {
      title: 'Play Card',
      choices,
      min: 0,
    }
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generateBuyActions = function() {
  const influence = this.getPlayerCurrent().influence
  const choices = []

  for (const card of this.getZoneById('market').cards()) {
    if (card.cost <= influence) {
      choices.push(card)
    }
  }

  const priestess = this.getZoneById('priestess').cards()[0]
  if (priestess && priestess.cost <= influence) {
    choices.push(priestess)
  }

  const guard = this.getZoneById('guard').cards()[0]
  if (guard && guard.cost <= influence) {
    choices.push(guard)
  }

  if (choices.length > 0) {
    return {
      title: 'Recruit',
      choices,
      min: 0,
    }
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generatePowerActions = function() {
  const player = this.getPlayerCurrent()
  const choices = []

  const power = player.power
  if (power >= 1 && this.getCardsByZone(player, 'troops').length > 0) {
    choices.push('Place a Troop')
  }
  if (power >= 3) {
    choices.push('Assassinate a Troop')
    choices.push('Return an Enemy Spy')
  }

  return {
    title: 'Use Power',
    choices,
    min: 0,
  }
}

Tyrants.prototype._generatePassAction = function() {
  return 'Pass'
}

Tyrants.prototype.endOfTurn = function() {
  // Promote troops.
  // Receive VPs from site control tokens.
}

Tyrants.prototype.cleanup = function() {
  const player = this.getPlayerCurrent()

  this.mLog({
    template: '{player} moves played cards to discard pile.',
    args: { player }
  })

  for (const card of this.getCardsByZone(player, 'played')) {
    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'discard'))
  }

  const hand = this.getCardsByZone(player, 'hand')
  if (hand.length > 0) {
    this.mLog({
      template: '{player} discards {count} remaining cards',
      args: { player, count: hand.length }
    })
    for (const card of hand) {
      this.mMoveCardTo(card, this.getZoneByPlayer(player, 'discard'))
    }
  }
}

Tyrants.prototype.drawHand = function() {
  this.mRefillHand(this.getPlayerCurrent())
}

Tyrants.prototype.nextPlayer = function() {
  this.currentPlayer = this.getPlayerNext()
  this.state.turn += 1
}


////////////////////////////////////////////////////////////////////////////////
// Core Functionality

Tyrants.prototype.aChooseAndAssassinate = function(player) {

}

Tyrants.prototype.aChooseAndDevourMarket = function(player) {

}

Tyrants.prototype.aChooseAndSupplant = function(player) {

}

Tyrants.prototype.aChooseAndDeploy = function(player) {

}

Tyrants.prototype.aChooseAndDiscard = function(player) {

}

Tyrants.prototype.aChooseAndPlaceSpy = function(player) {

}

Tyrants.prototype.aChooseAndPromote = function(player, choices) {

}

Tyrants.prototype.aChooseAndReturn = function(player) {

}

Tyrants.prototype.aChooseOne = function(player, choices) {

}

Tyrants.prototype.aDeferPromotion = function(player, source) {

}

Tyrants.prototype.aReturnASpyAnd = function(player, fn) {

  return {
    loc: 'tbd'
  }
}

Tyrants.prototype.aAssassinate = function(player, loc) {

}

Tyrants.prototype.aDeploy = function(player, loc) {

}

Tyrants.prototype.aDevour = function(player, card) {

}

Tyrants.prototype.aDraw = function(player, opts={}) {
  const deck = this.getZoneByPlayer(player, 'deck')
  const hand = this.getZoneByPlayer(player, 'hand')

  if (deck.cards().length === 0) {
    // See if we can reshuffle.
    // If not, do nothing.
    throw new Error('Unable to draw from empty deck')
  }

  if (!opts.silent) {
    this.mLog({
      template: '{player} draws a card',
      args: { player }
    })
  }
  this.mMoveByIndices(deck, 0, hand, hand.cards().length)
}

Tyrants.prototype.aMove = function(player, start, end) {

}

Tyrants.prototype.aPlaceSpy = function(player, loc) {

}

Tyrants.prototype.aPlayCard = function(player, card) {

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

Tyrants.prototype.getCardsByZone = function(player, name) {
  return this.getZoneByPlayer(player, name).cards()
}

Tyrants.prototype.getExpansionList = function() {
  return this.settings.expansions
}

Tyrants.prototype.getLocationAll = function() {
  return Object.values(this.state.zones.map)
}

Tyrants.prototype.getLocationsByPresence = function(player) {
  return this
    .getLocationAll()
    .filter(loc => loc.chechHasPresence(player))
}

Tyrants.prototype.getPlayerAll = function() {
  return this.state.players
}

Tyrants.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(player => player.name === name)
}

Tyrants.prototype.getPlayerCurrent = function() {
  util.assert(this.state.currentPlayer, 'No current player')
  return this.state.currentPlayer
}

Tyrants.prototype.getPlayerNext = function() {
  const currIndex = this.getPlayerAll().indexOf(this.getPlayerCurrent())
  const nextIndex = (currIndex + 1) % this.getPlayerAll().length
  return this.getPlayerAll()[nextIndex]
}

Tyrants.prototype.getRound = function() {
  return Math.floor(this.state.turn / this.getPlayerAll().length) + 1
}

Tyrants.prototype.getZoneByCard = function(card) {
  return this.getZoneById(card.zone)
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

Tyrants.prototype.mAdjustPresence = function(source, target, card) {
  if (card.isSpy || card.isToken) {
    const toUpdate = [
      source,
      ...this.getNeighbors(source),
      target,
      ...this.getNeighbors(target),
    ]

    toUpdate
      .filter(loc => loc !== undefined)
      .filter(loc => loc.kind === 'location')
      .forEach(loc => this.mCalculatePresence(loc))
  }
}

Tyrants.prototype.mCalculatePresence = function(location) {
  const relevant = [
    location,
    ...this.getNeighbors(location)
  ]

  const players = relevant
    .flatMap(loc => loc.cards())
    .map(card => this.getPlayerByCard(card))

  location.presence = util.array.distinct(players)
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
  this.mAdjustPresence(source, target, card)
  return card
}

Tyrants.prototype.mMoveCardTo = function(card, zone) {
  const source = this.getZoneByCard(card)
  const index = source.cards().indexOf(card)
  this.mMoveByIndices(source, index, zone, zone.cards().length)
}

Tyrants.prototype.mShuffle = function(zone) {
  util.array.shuffle(zone._cards, this.random)
}

Tyrants.prototype.mRefillHand = function(player) {
  const zone = this.getZoneByPlayer(player, 'hand')
  while (zone.cards().length < 5) {
    this.aDraw(player, { silent: true })
  }
  this.mLog({
    template: '{player} refills their hand',
    args: { player }
  })
}

Tyrants.prototype.mRefillMarket = function() {
  const deck = this.getZoneById('marketDeck')
  const market = this.getZoneById('market')
  const count = 6 - market.cards().length
  for (let i = 0; i < count; i++) {
    this.mMoveByIndices(deck, 0, market, market.cards().length)
  }
}

Tyrants.prototype._enrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    if (key === 'players') {
      const players = msg.args[key]
      msg.args[key] = {
        value: players.map(p => p.name).join(', '),
        classes: ['player-names'],
      }
    }
    else if (key.startsWith('player')) {
      const player = msg.args[key]
      msg.args[key] = {
        value: player.name,
        classes: ['player-name']
      }
    }
    else if (key.startsWith('card')) {
      const card = msg.args[key]
      msg.args[key] = card.name
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

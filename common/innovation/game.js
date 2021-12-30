const base = require('../lib/gameBase.js')
const util = require('../lib/util.js')

const res = require('./resources.js')
const transitions = require('./transitions/transitions.js')

module.exports = {
  Game,
  factory,
  res: require('./resources.js'),
}

function Game() {}

function factory(lobby) {
  const state = base.stateFactory(lobby)

  ////////////////////////////////////////////////////////////////////////////////
  // Custom state

  // Monument Achievement tuck and score counts
  state.counters.cardsTucked = 0
  state.counters.cardsScored = 0

  // Current turn information
  state.turn.action = 1

  const game = new Game()
  game.load(transitions, state, contextEnricher)
  return game
}

function contextEnricher(context) {
  const game = context.state
  if (game.state.initialized) {
    context.game = game
    if (context.data.playerName) {
      context.actor = game.getPlayerByName(context.data.playerName)
    }
    if (context.response) {
      context.options = context.response.option.map(o => o.name || o)
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Prototype inheritance

Game.prototype = Object.create(base.GameBase.prototype)
Object.defineProperty(Game.prototype, 'constructor', {
  value: Game,
  enumerable: false,
  writable: true
})


////////////////////////////////////////////////////////////////////////////////
// Custom functions

Game.prototype.checkCardsEqual = function(c1, c2) {
  c1 = this._adjustCardParam(c1)
  c2 = this._adjustCardParam(c2)

  if (c1.id && c2.id) {
    return c1.id === c2.id
  }
  else if (c1.id) {
    return c1.id === c2
  }
  else if (c2.id) {
    return c1 === c2.id
  }
  else {
    return c1 === c2
  }
}

Game.prototype.getCardData = function(card) {
  card = this._adjustCardParam(card)
  return res.all.byName[card]
}

Game.prototype.getExpansionList = function() {
  return this.state.options.expansions
}

Game.prototype.getBiscuits = function(player) {
  throw new Error('not implemented')

  const board = this.utilEmptyBiscuits()
  const final = this.utilCombineBiscuits(this.utilEmptyBiscuits(), board)

  for (const trigger of this.getTriggers(player, 'biscuit')) {
    this.utilAddBiscuits(final, trigger(board, this))
  }

  return {
    board,
    final
  }
}

// Overload GameBase because that assumes cards are objects instead of just strings
Game.prototype.getZoneByCard = function(card) {
  card = this._adjustCardParam(card)
  const { zoneName } = this.getCardByPredicate(c => this.checkCardsEqual(c, card))
  util.assert(!!zoneName, `No zone found for card`)
  return this.getZoneByName(zoneName)
}

Game.prototype.getDeck = function(exp, age) {
  return this.getZoneByName(`decks.${exp}.${age}`)
}

Game.prototype.getHand = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.hand`)
}

Game.prototype.getTriggers = function(player, name) {
  throw new Error('not implemented')
}

Game.prototype.getZoneColorByPlayer = function(player, color) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.${color}`)
}

Game.prototype.mSetVisibilityForZone = function(zone, card) {
  /* if (zone.kind === 'private') {
   *   this.rk.replace(card.visibility, [zone.owner])
   * }
   * else if (zone.kind === 'public') {
   *   this.rk.replace(card.visibility, this.getPlayerAll().map(p => p.name))
   * }
   * else if (zone.kind === 'deck') {
   *   this.rk.replace(card.visibility, [])
   * }
   * else {
   *   throw new Error(`Unhandled visibility type for zone: ${zone.kind}`)
   * } */
}

Game.prototype.mDraw = function(player, exp, age) {
  player = this._adjustPlayerParam(player)
  const base = this.getDeck('base', age)
  const deck = this.getDeck(exp, age)
  const hand = this.getHand(player)

  util.assert(
    this.getExpansionList().includes(exp),
    `Can't draw from ${deck.name} because ${exp} is not being used.`)
  util.assert(
    base.cards.length > 0,
    `Can't draw from ${deck.name} because ${base.name} is empty`)
  util.assert(
    deck.cards.length > 0,
    `Can't draw from ${deck.name} because it is empty`)

  this.mMoveCard(deck, hand)
}

Game.prototype.mMoveCard = function(source, target, card) {
  source = this._adjustZoneParam(source)
  target = this._adjustZoneParam(target)
  card = this._adjustCardParam(card)

  let cardIndex

  if (card) {
    cardIndex = source.cards.findIndex(c => this.checkCardsEqual(c, card))
  }
  else {
    card = source.cards[0]
    cardIndex = 0
  }

  util.assert(cardIndex !== -1, `${card} not found in ${source.name}`)

  this.mMoveByIndices(source, cardIndex, target, target.cards.length)
  this.mSetVisibilityForZone(target, card)
}

Game.prototype.mReturnCard = function(card) {
  card = this._adjustCardParam(card)
  const zone = this.getZoneByCard(card)
  const data = this.getCardData(card)
  const homeDeck = this.getDeck(data.expansion, data.age)
  this.mMoveCard(zone, homeDeck, card)
}

Game.prototype.mSetStartingPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  const index = this.getPlayerAll().findIndex(p => p.name === player.name)
  this.rk.put(this.state.turn, 'playerIndex', index)
}

Game.prototype.mShuffleDeck = function(deck) {
  deck = this._adjustZoneParam(deck)
}

Game.prototype.utilEmptyBiscuits = function() {
  return {
    c: 0,
    f: 0,
    i: 0,
    k: 0,
    l: 0,
    s: 0,
  }
}

Game.prototype._adjustCardParam = function(card) {
  return card
}

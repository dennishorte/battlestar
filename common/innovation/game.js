const base = require('../lib/gameBase.js')

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

  const game = new Game()
  game.load(transitions, state, contextEnricher)
  return game
}

function contextEnricher(context) {
  const game = context.state
  if (game.state.initialized) {
    context.game = game
    context.actor = game.getPlayerByName(context.data.playerName)
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

Game.prototype.getDeck = function(exp, age) {
  return this.getZoneByName(`${exp}-${age}`)
}

Game.prototype.getHand = function(player) {
  return this.getZoneByPlayer(player)
}

Game.prototype.getTriggers = function(player, name) {
  throw new Error('not implemented')
}

Game.prototype.mDraw = function(player, exp, age) {
  player = this._adjustPlayerParam(player)
  const base = game.getDeck('base', age)
  const deck = game.getDeck(exp, age)
  const hand = game.getHand(player)

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

Game.prototype.mMoveCard = function(source, target) {
  source = this._adjustZoneParam(source)
  target = this._adjustZoneParam(target)
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

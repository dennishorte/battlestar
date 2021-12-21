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
  const game = new Game()
  game.load(transitions, state)
  return game
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

}

Game.prototype.getZoneByAge = function(exp, age) {

}

Game.prototype.mDraw = function(player) {
  player = this._adjustPlayerParam(player)
}

Game.prototype.mMoveCard = function(source, target) {
  source = this._adjustZoneParam(source)
  target = this._adjustZoneParam(target)
}

Game.prototype.mShuffleDeck = function(deck) {
  deck = this._adjustZoneParam(deck)
}

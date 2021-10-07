const RecordKeeper = require('../lib/recordkeeper.js')
const StateMachine = require('../lib/statemachine.js')

const initialize = require('./initialize.js')
const transitions = require('./transitions.js')

module.exports = {
  Game,
  factory,

  deckbuilder: require('./deckbuilder.js'),
  res: require('./resources.js'),
  util: require('./util.js'),
}

function Game(state) {
  this.state = state
  this.rk = new RecordKeeper(state)
  this.sm = new StateMachine(transitions, state)
}

function factory(lobby) {
  const state = {
    game: lobby.game,
    name: lobby.name,
    options: lobby.options,
    users: lobby.users,
    createdTimestamp: Date.now(),
    saveKey: 0,
    initialized: false,
  }

  initialize(state)

  return new Game(state)
}

const getters = {
  card: {},
  zone: {},
}
const mutations = {
  player: {},
}

Game.prototype.run = run

Game.prototype.getters = getters
Game.prototype.mutations = mutations


function run() {

}


getters.players = function() {
  return this.state.players
}

mutations.redo = function() { this.rk.redo() }
mutations.undo = function() { this.rk.undo() }

mutations.player.assignCharacter = function(playerName, characterName) {
  const playerHand = this.getters.zone.byPlayerName(playerName)
  const characterCard = this.getters.card.byName(characterName)
  this.rk.session.move(character, playerHand)
}

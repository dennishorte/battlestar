const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('./game.js')
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

Tyrants.prototype._responseReceived = function(response) {
  if (response.isUserResponse) {

    this.state.log.push({
      type: 'response-received',
      data: response,
    })
  }
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

Tyrants.prototype.initialize = function() {

}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Tyrants.prototype.mainLoop = function() {

}

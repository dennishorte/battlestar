const { AgricolaActionManager } = require('../AgricolaActionManager.js')

AgricolaActionManager.prototype.takeStartingPlayer = function(player) {
  this.game.state.startingPlayer = player.name
  // Note: Food is given separately by action.gives, not here

  this.log.add({
    template: '{player} becomes starting player',
    args: { player },
  })

  return true
}

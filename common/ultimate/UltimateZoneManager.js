const { BaseZoneManager } = require('../lib/game/index.js')

class UltimateZoneManager extends BaseZoneManager {
  byDeck(exp, age) {
    const id = `decks.${exp}.${age}`
    return this.byId(id)
  }

  colorStacks(player) {
    return this.game.util.colors().map(color => this.byPlayer(player, color))
  }
}

module.exports = {
  UltimateZoneManager,
}

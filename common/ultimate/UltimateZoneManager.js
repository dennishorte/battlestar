const { BaseZoneManager } = require('../lib/game/index.js')

class UltimateZoneManager extends BaseZoneManager {
  byDeck(exp, age) {
    const id = `decks.${exp}.${age}`
    return this.byId(id)
  }

  colorStacks(player) {
    return this.game.util.colors().map(color => this.byPlayer(player, color))
  }

  stacksWithBiscuit(player, biscuit) {
    return Object
      .values(player.biscuitsByColor())
      .map(biscuits => biscuits[biscuit])
      .filter(num => num > 0)
  }
}

module.exports = {
  UltimateZoneManager,
}

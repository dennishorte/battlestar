const { BaseZoneManager } = require('../lib/game/index.js')

class UltimateZoneManager extends BaseZoneManager {
  byDeck(exp, age) {
    const id = `decks.${exp}.${age}`
    return this.byId(id)
  }
}

module.exports = {
  UltimateZoneManager,
}

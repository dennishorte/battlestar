const { BaseCardManager } = require('../lib/game/index.js')

class UltimateCardManager extends BaseCardManager {
  constructor(...args) {
    super(...args)
  }

  registerExpansion(exp, data) {
    this._expansions[exp] = data

    for (const card of data.cards) {
      this.register(card)
    }

    for (const ach of data.achievements) {
      this.register(ach)
    }
  }

  byDeck(exp, age) {
    const id = `decks.${exp}.${age}`
    return this.game.zones.byId(id).cards()
  }

  byExp(exp) {
    return this._expansions[exp]
  }

  reset() {
    super.reset()
    this._expansions = {}
  }
}

module.exports = {
  UltimateCardManager,
}

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
    return this.game.zones.byId(id).cardlist()
  }

  byExp(exp) {
    return this._expansions[exp]
  }

  tops(player) {
    return this.zones.colorStacks(player).map(zone => zone.peek()).filter(x => Boolean(x))
  }

  topsAll() {
    return this.players.all().flatMap(player => this.tops(player))
  }

  reset() {
    super.reset()
    this._expansions = {}
  }
}

module.exports = {
  UltimateCardManager,
}

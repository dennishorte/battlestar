const { GameProxy } = require('./GameProxy.js')

class BaseCardManager {
  constructor(game) {
    this.game = game
    this.reset()

    return GameProxy.create(this)
  }

  register(card) {
    if (card.id in this._cards) {
      throw new Error('Duplicate card ids: ' + card.id)
    }
    this._cards[card.id] = card
  }

  byId(id) {
    if (!Object.hasOwn(this._cards, id)) {
      throw new Error('Unknown card: ' + id)
    }
    return this._cards[id]
  }

  byPlayer(player, zoneName) {
    return this.zones.byPlayer(player, zoneName).cardlist()
  }

  byZone(zoneId) {
    return this.zones.byId(zoneId).cardlist()
  }

  reset() {
    this._cards = {}
  }
}

module.exports = {
  BaseCardManager,
}

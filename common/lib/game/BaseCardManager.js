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
    this._cards[this._getCardId(card)] = card
  }

  all() {
    return Object.values(this._cards)
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

  hasId(id) {
    return (id in this._cards)
  }

  reset() {
    this._cards = {}
  }

  _getCardId(card) {
    return card.id
  }
}

module.exports = {
  BaseCardManager,
}

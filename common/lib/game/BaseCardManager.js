class BaseCardManager {
  constructor(game) {
    this.game = game
    this.reset()
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

  reset() {
    this._cards = {}
  }
}

module.exports = {
  BaseCardManager,
}

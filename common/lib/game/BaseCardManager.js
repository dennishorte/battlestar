class BaseCardManager {
  constructor(game) {
    this._game = game
    this._cards = {}
  }

  register(card) {
    if (card.id in this._cards) {
      throw new Error('Duplicate card ids: ' + card.id)
    }
    this._cards[card.id] = card
  }

  byId(id) {
    return this._cards[id]
  }
}

module.exports = {
  BaseCardManager,
}

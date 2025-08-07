const { BaseCardManager } = require('../lib/game/index.js')

class MagicCardManager extends BaseCardManager {
  constructor(...args) {
    super(...args)
  }

  _getCardId(card) {
    return card.g.id
  }
}

module.exports = {
  MagicCardManager,
}

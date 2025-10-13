const { BaseCardManager } = require('../lib/game/index.js')

class MagicCardManager extends BaseCardManager {
  constructor(...args) {
    super(...args)
  }
}

module.exports = {
  MagicCardManager,
}

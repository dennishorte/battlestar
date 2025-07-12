const { BasePlayerManager } = require('../lib/game/index.js')


class MagicPlayerManager extends BasePlayerManager {
  byController(card) {
    return this.byZone(card.zone)
  }
}

module.exports = { MagicPlayerManager }

const { BasePlayerManager } = require('../lib/game/index.js')


class MagicPlayerManager extends BasePlayerManager {
  byController(card) {
    const zone = this._game.getZoneByCard(card)
    return this.byZone(zone)
  }
}

module.exports = { MagicPlayerManager }

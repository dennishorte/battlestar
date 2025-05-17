const { PlayerManager } = require('../lib/game/PlayerManager.js')


class MagicPlayerManager extends PlayerManager {
  byController(card) {
    const zone = this._game.getZoneByCard(card)
    return this.byZone(zone)
  }
}

module.exports = { MagicPlayerManager }

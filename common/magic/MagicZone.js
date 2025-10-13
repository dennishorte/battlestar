const { BaseZone, ZONE_KIND } = require('../lib/game/index.js')

class MagicZone extends BaseZone {
  _updateCardVisibility(card) {
    if (this._kind === ZONE_KIND.public) {
      if (card.morph || card.secret) {
        card.show(this.owner())
      }
      else {
        card.reveal()
      }
    }
    else if (this._kind === ZONE_KIND.private) {
      card.show(this.owner())
    }
    else if (this._kind === ZONE_KIND.hidden) {
      card.hide()
    }
    else {
      throw new Error('Unknown zone kind: ' + this._kind)
    }
  }
}

module.exports = {
  MagicZone,
}

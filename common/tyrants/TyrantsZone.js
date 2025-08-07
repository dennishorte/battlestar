const { BaseZone, ZONE_KIND } = require('../lib/game/index.js')

class TyrantsZone extends BaseZone {
  _updateCardVisibility(card) {
    if (this._kind === ZONE_KIND.public || this._kind === 'location') {
      card.reveal()
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
  TyrantsZone,
}

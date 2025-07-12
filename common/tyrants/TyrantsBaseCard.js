const { BaseCard } = require('../lib/game/BaseCard.js')

class TyrantsBaseCard extends BaseCard {
  getOwnerName() {
    return !this.owner ? 'neutral' : this.owner.name
  }

  moveTo(zone, index=null) {
    const source = this.zone
    const preControlMarkers = this.game.getControlMarkers()

    super.moveTo(zone, index)

    this.game.mCheckZoneLimits(zone)
    this.game.mAdjustPresence(source, zone, this)
    this.game.mAdjustControlMarkerOwnership(preControlMarkers)
    return this
  }
}

module.exports = {
  TyrantsBaseCard,
}

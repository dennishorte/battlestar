const { BaseCard } = require('../lib/game/BaseCard.js')

class TyrantsBaseCard extends BaseCard {
  getOwnerName() {
    return !this.owner ? 'neutral' : this.owner.name
  }

  _afterMoveTo(newZone, _newIndex, oldZone, _oldIndex, data) {
    this.game.mCheckZoneLimits(newZone)
    this.game.mAdjustPresence(oldZone, newZone, this)
    this.game.mAdjustControlMarkerOwnership(data.controlMarkers)
  }

  _beforeMoveTo() {
    return {
      controlMarkers: this.game.getControlMarkers(),
    }
  }
}

module.exports = {
  TyrantsBaseCard,
}

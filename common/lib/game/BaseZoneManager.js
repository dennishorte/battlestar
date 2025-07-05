const { BaseZone } = require('./BaseZone.js')

class BaseZoneManager {
  constructor(game) {
    this._zoneConstructor = BaseZone
    this._game = game
    this._zones = {}
  }

  create(...args) {
    const zone = new this._zoneConstructor(...args)
    this.register(zone)
    return zone
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  byCard(card) {
    return card.zone
  }

  byId(id) {
    return this.zones[id]
  }

  register(zone) {
    if (Object.hasOwn(this._zones, zone.id)) {
      throw new Error('Duplicate zone id: ' + zone.id)
    }
    this._zones[zone.id] = zone
  }
}

module.exports = {
  BaseZoneManager,
}

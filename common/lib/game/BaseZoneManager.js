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

  register(zone) {
    if (Object.hasOwn(this._zones, zone.id)) {
      throw new Error('Duplicate zone id: ' + zone.id)
    }
    this._zones[zone.id] = zone
  }

  reset() {
    this._zones = {}
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  byCard(card) {
    return card.zone
  }

  byId(id) {
    return this._zones[id]
  }

  byPlayer(player, zoneName) {
    const id = `players.${player.name}.${zoneName}`
    return this.byId(id)
  }
}

module.exports = {
  BaseZoneManager,
}

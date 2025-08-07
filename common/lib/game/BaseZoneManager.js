const { BaseZone } = require('./BaseZone.js')
const { GameProxy } = require('./GameProxy.js')

class BaseZoneManager {
  constructor(game) {
    this._zoneConstructor = BaseZone
    this.game = game
    this._zones = {}

    return GameProxy.create(this)
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

  all() {
    return Object.values(this._zones)
  }

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

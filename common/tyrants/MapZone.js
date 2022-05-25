const Zone = require('./Zone.js')
const util = require('../lib/util.js')

module.exports = MapZone


function MapZone(data) {
  this.id = `map.${data.name}`
  this.name = data.name
  this.kind = 'location'
  this.owner = undefined
  this._cards = []

  this.short = data.short
  this.region = data.region
  this.size = data.size
  this.neutrals = data.neutrals
  this.points = data.points
  this.start = data.start
  this.control = data.control
  this.totalControl = data.totalControl
  this.neighborNames = data.neighbors

  this.presence = []
}

////////////////////////////////////////////////////////////////////////////////
// Inheritance
util.inherit(Zone, MapZone)


////////////////////////////////////////////////////////////////////////////////
// Public interface

MapZone.prototype.addPresence = function(player) {
  util.array.pushUnique(this.presence, player)
}

MapZone.prototype.checkHasPresence = function(player) {
  return this.presence.includes(player)
}

MapZone.prototype.getController = function() {

}

MapZone.prototype.getTotalController = function() {

}

MapZone.prototype.getTroops = function(player) {
  return this._filteredTokens(x => x.isTroop, player)
}

MapZone.prototype.getSpies = function(player) {
  return this._filteredTokens(x => x.isSpy, player)
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

MapZone.prototype._filteredTokens = function(fn, player) {
  const troops = this
    ._cards
    .filter(token => fn(token))

  if (player) {
    return troops.filter(token => token.owner === player)
  }

  else {
    return troops
  }
}

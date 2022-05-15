const Zone = require('./Zone.js')
const util = require('../lib/util.js')

module.exports = MapZone


function MapZone(data) {
  this.id = data.name
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
}

////////////////////////////////////////////////////////////////////////////////
// Inheritance
util.inherit(Zone, MapZone)


////////////////////////////////////////////////////////////////////////////////
// Public interface

MapZone.prototype.getController = function() {

}

MapZone.prototype.getTotaller = function() {

}

MapZone.prototype.getTroops = function(player) {
  return this._filteredTokens('troop', player)
}

MapZone.prototype.getSpies = function(player) {
  return this._filteredTokens('spy', player)
}


////////////////////////////////////////////////////////////////////////////////
// Private functions

MapZone.prototype._filteredTokens = function(kind, player) {
  const troops = this
    ._cards
    .filter(token => token.kind === kind)

  if (player) {
    return troops.filter(token => token.owner === player)
  }

  else {
    return troops
  }
}

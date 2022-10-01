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

MapZone.prototype.checkHasOpenTroopSpace = function() {
  return this.cards().filter(card => card.isTroop).length < this.size
}

MapZone.prototype.checkHasPresence = function(player) {
  return this.presence.includes(player)
}

MapZone.prototype.getController = function() {

}

MapZone.prototype.getTotalController = function() {
  // Passageways cannot have total controllers
  if (this.points === 0) {
    return null
  }

  const troops = this.getTroops()

  // All troop spaces must be full.
  if (troops.length !== this.size) {
    return null
  }

  // All troops must belong to the same player.
  if (troops.length !== util.array.distinct(troops).length) {
    return null
  }

  const candidate = troops[0].owner

  // Player is defined (not neutral)
  if (candidate === undefined) {
    return null
  }

  // No enemy spies.
  if (this.getSpies().every(spy => spy.owner === candidate)) {
    return candidate
  }
  else {
    return null
  }
}

MapZone.prototype.getTokens = function(kind, player) {
  if (kind === 'troops') {
    return this.getTroops(player)
  }
  else if (kind === 'spies') {
    return this.getSpies(player)
  }
  else {
    return this.getCards(player)
  }
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
    .cards()
    .filter(token => fn(token))

  if (player === 'neutral') {
    return troops.filter(token => token.owner === undefined)
  }

  else if (player) {
    return troops.filter(token => token.owner === player)
  }

  else {
    return troops
  }
}

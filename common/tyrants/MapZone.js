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

  this.ui = data.ui

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

MapZone.prototype.checkIsMajorSite = function() {
  return this.checkIsSite() && this.control.influence > 0
}

MapZone.prototype.checkIsMinorSite = function() {
  return this.checkIsSite() && this.control.influence === 0
}

MapZone.prototype.checkIsSite = function() {
  return this.points > 0
}

MapZone.prototype.getControlMarker = function() {
  if (this.control.influence === 0) {
    return undefined
  }

  const marker = {
    locName: this.name,
    influence: 0,
    points: 0,
    total: false,
    ownerName: '',
  }

  const controller = this.getController()
  const totaller = this.getTotalController()

  if (totaller) {
    marker.influence = this.totalControl.influence
    marker.points = this.totalControl.points
    marker.total = true
    marker.ownerName = totaller.name
  }

  else if (controller) {
    marker.influence = this.control.influence
    marker.points = this.control.points
    marker.ownerName = controller.name
  }

  return marker
}

MapZone.prototype.getEmptySpaces = function() {
  return this.size - this.getTroops().length
}

MapZone.prototype.getController = function() {
  // Passageways cannot have total controllers
  if (this.points === 0) {
    return null
  }

  const troops = this.getTroops()

  // Player with the most troops at the site.
  const playerMap = {}  // name: PlayerObject
  const counts = {}  // name: count
  for (const troop of this.getTroops()) {
    const owner = troop.owner ? troop.owner.name : 'neutral'
    playerMap[owner] = troop.owner
    counts[owner] = (counts[owner] || 0) + 1
  }

  const mostEntry = util.array.uniqueMaxBy(Object.entries(counts), (entry) => entry[1])
  if (mostEntry && mostEntry[0] !== 'neutral') {
    return playerMap[mostEntry[0]]
  }
  else {
    return undefined
  }
}

MapZone.prototype.getTotalController = function() {
  // Passageways cannot have total controllers
  if (!this.checkIsSite()) {
    return undefined
  }

  // All troop spaces must be full.
  if (this.getTroops().length !== this.size) {
    return undefined
  }

  // All troops must belong to the same player.
  if (util.array.distinct(this.getTroops().map(t => t.owner)).length !== 1) {
    return undefined
  }

  const candidate = this.getTroops()[0].owner

  // Player is defined (not neutral)
  if (candidate === undefined) {
    return undefined
  }

  // No enemy spies.
  if (this.getSpies().every(spy => spy.owner === candidate)) {
    return candidate
  }
  else {
    return undefined
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

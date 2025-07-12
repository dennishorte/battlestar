const { TyrantsZone } = require('./TyrantsZone.js')
const util = require('../lib/util.js')

class TyrantsMapZone extends TyrantsZone {
  constructor(game, data) {
    super(game, `map.${data.name}`, data.name, 'location')

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
  // Public interface

  addPresence(player) {
    util.array.pushUnique(this.presence, player)
  }

  checkHasOpenTroopSpace() {
    return this.cards().filter(card => card.isTroop).length < this.size
  }

  checkHasPresence(player) {
    return this.presence.includes(player)
  }

  checkIsMajorSite() {
    return this.checkIsSite() && this.control.influence > 0
  }

  checkIsMinorSite() {
    return this.checkIsSite() && this.control.influence === 0
  }

  checkIsSite() {
    return this.points > 0
  }

  getControlMarker() {
    if (this.control.influence === 0) {
      return undefined
    }

    const marker = {
      locName: this.name(),
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

  getEmptySpaces() {
    return this.size - this.getTroops().length
  }

  getController() {
    // Passageways cannot have total controllers
    if (this.points === 0) {
      return null
    }

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

  getTotalController() {
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
    if (!candidate) {
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

  getTokens(kind, player) {
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

  getTroops(player) {
    return this._filteredTokens(x => x.isTroop, player)
  }

  getSpies(player) {
    return this._filteredTokens(x => x.isSpy, player)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Private functions

  _filteredTokens(fn, player) {
    const troops = this
      .cards()
      .filter(token => fn(token))

    if (player === 'neutral') {
      return troops.filter(token => !token.owner)
    }

    else if (player) {
      return troops.filter(token => token.owner === player)
    }

    else {
      return troops
    }
  }
}

module.exports = {
  TyrantsMapZone,
}

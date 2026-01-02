const { GameProxy } = require('./GameProxy.js')
const util = require('../util.js')

class BaseCard {
  constructor(game, data) {
    this.game = game
    this.data = data

    this.id = data.id || null
    this.owner = null

    this.home = null  // Home location (where it returns to)
    this.zone = null  // Current location
    this.visibility = []

    return GameProxy.create(this)
  }

  equals(other) {
    return this.id === other.id
  }

  setHome(zone) {
    this.home = zone
  }

  setZone(zone) {
    this.zone = zone
  }

  moveHome() {
    this.moveTo(this.home)
  }

  moveTo(zone, index=null) {
    const prevZone = this.zone
    const prevIndex = this.zone.cardlist().findIndex(card => card.id === this.id)

    let newIndex = index

    // If no index is specified, put the card on the bottom of the zone.
    if (index === null) {
      newIndex = zone.nextIndex()

      // If the card is moving within the same zone, its movement will reduce the total number
      // of items in the zone.
      if (prevZone.id === zone.id) {
        newIndex -= 1
      }
    }

    // The index for the card has been specified, but we need to check if the card is moving within
    // the same zone, and if so, if it is moving to a lower position than where it started.
    else if (prevZone.id === zone.id) {
      if (index > prevIndex) {
        newIndex -= 1
      }
    }

    const beforeCache = this._beforeMoveTo(zone, index, prevZone, prevIndex) || {}

    if (beforeCache.preventDefault) {
      return null
    }

    zone.push(this, newIndex)
    this._afterMoveTo(zone, index, prevZone, prevIndex, beforeCache)

    return this
  }

  moveToTop(zone) {
    this.moveTo(zone, 0)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Visibility

  hide() {
    this.visibility = []
  }

  reveal() {
    this.visibility = this.players.all()
  }

  revealed() {
    return this.visibility.length === this.players.all().length
  }

  show(player) {
    util.array.pushUnique(this.visibility, player)
  }

  visible(player) {
    return this.visibility.some(other => other.name === player.name)
  }

  // eslint-disable-next-line no-unused-vars
  _afterMoveTo(newZone, newIndex, oldZone, oldIndex) {
    // To be overridden by child classes
  }

  // eslint-disable-next-line no-unused-vars
  _beforeMoveTo(newZone, newIndex, oldZone, oldIndex) {
    // To be overridden by child classes
  }
}

module.exports = {
  BaseCard,
}

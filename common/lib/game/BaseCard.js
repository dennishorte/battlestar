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
    const prevIndex = this.zone.cards().indexOf(this)
    const newIndex = index !== null
      ? index
      : (prevZone === zone
        ? zone.cards().length - 1
        : zone.cards().length)

    const beforeCache = this._beforeMoveTo(zone, index, prevZone, prevIndex) || {}

    if (beforeCache.preventDefault) {
      return null
    }

    // TODO: mark the player who did the moving as the actor, if appropriate

    // Remove from old zone
    this.zone.remove(this)

    // Add to new zone
    this.setZone(zone)
    this.zone.push(this, newIndex)

    this._afterMoveTo(zone, index, prevZone, prevIndex, beforeCache)

    return this
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Visibility

  hide() {
    this.visibility = []
  }

  reveal() {
    this.visibility = this.game.players.all()
  }

  revealed() {
    return this.visibility.length === this.game.players.all().length
  }

  show(player) {
    util.array.pushUnique(this.visibility, player)
  }

  visible(player) {
    return this.visibility.includes(player)
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

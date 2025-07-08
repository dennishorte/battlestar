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


  moveTo(zone, index=null) {
    // TODO: test if the card will actually move somewhere new
    // TODO: mark the player who did the moving as the actor, if appropriate

    // Remove from old zone
    this.zone.remove(this)

    // Add to new zone
    this.setZone(zone)
    this.zone.push(this, index)
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
}

module.exports = {
  BaseCard,
}

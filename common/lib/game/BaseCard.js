const util = require('../util.js')

class BaseCard {
  constructor(game, data) {
    this.game = game
    this.data = data

    this.id = data.id || null
    this.owner = null

    this.zone = null  // Current location
    this.visibility = []
  }

  moveTo(zone, index=null) {
    // Remove from old zone
    this.zone.remove(this)

    // Add to new zone
    this.zone = zone
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

const { BaseCard } = require('../lib/game/BaseCard.js')

class TyrantsToken extends BaseCard {
  constructor(game, id, name) {
    super(game, { id })

    this.name = name
    this.isTroop = false
    this.isSpy = false
  }

  getOwnerName() {
    return !this.owner ? 'neutral' : this.owner.name
  }

  isNeutral() {
    return !this.owner
  }

  isOtherPlayer(player) {
    return Boolean(this.owner) && this.owner !== player
  }
}

module.exports = {
  TyrantsToken,
}

const { TyrantsBaseCard } = require('./TyrantsBaseCard.js')

class TyrantsToken extends TyrantsBaseCard {
  constructor(game, id, name) {
    super(game, { id })

    this.name = name
    this.isTroop = false
    this.isSpy = false
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

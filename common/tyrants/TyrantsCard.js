const { BaseCard } = require('../lib/game/BaseCard.js')

class TyrantsCard extends BaseCard {
  constructor(game, data) {
    super(game, data)

    Object.assign(this, {
      name: undefined,
      aspect: undefined,
      race: undefined,
      expansion: undefined,
      cost: undefined,
      points: undefined,
      innerPoints: undefined,
      count: undefined,
      text: [],
      isTroop: false,
      isSpy: false,
      autoPlay: false,
      ...data,
    })
  }

  getOwnerName() {
    return this.owner === undefined ? 'neutral' : this.owner.name
  }
}

module.exports = {
  TyrantsCard,
}

const { TyrantsBaseCard } = require('./TyrantsBaseCard.js')

class TyrantsCard extends TyrantsBaseCard {
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
}

module.exports = {
  TyrantsCard,
}

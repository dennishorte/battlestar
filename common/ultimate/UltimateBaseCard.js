const { BaseCard } = require('../lib/game/index.js')

class UltimateBaseCard extends BaseCard {
  constructor(game, data) {
    super(game, data)

    // Card names are unique in Innovation, so we'll use them for the card IDs.
    this.id = data.name
  }

  checkIsStandardAchievement() {
    return !this.isSpecialAchievement && !this.isDecree
  }

  getAge() {
    return this.age
  }
}

module.exports = {
  UltimateBaseCard,
}

const { BaseCard } = require('../lib/game/index.js')

class UltimateBaseCard extends BaseCard {
  constructor(game, data) {
    super(game, data)

    this.id = data.name
    this.owner = null
    this.home = null
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

const { UltimateBaseCard } = require('./UltimateBaseCard.js')

class UltimateAchievement extends UltimateBaseCard {
  constructor(game, data) {
    super(game, data)

    Object.assign(this, {
      version: 2,
      name: '',
      shortName: '',
      expansion: '',
      text: '',
      alt: '',
      isSpecialAchievement: true,
      isDecree: false,
      // eslint-disable-next-line no-unused-vars
      checkPlayerIsEligible: (game, player, reduceCost) => false,

      ...data
    })
  }
}

module.exports = {
  UltimateAchievement,
}

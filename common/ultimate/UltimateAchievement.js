const { UltimateBaseCard } = require('./UltimateBaseCard.js')

class UltimateAchievement extends UltimateBaseCard {
  constructor(data) {
    super(data.name)

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
    })
  }
}

module.exports = {
  UltimateAchievement,
}

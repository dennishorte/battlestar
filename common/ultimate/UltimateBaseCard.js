class UltimateBaseCard {
  constructor(id) {
    this.id = id
    this.owner = null
    this.zone = null
    this.visibility = []
    this.home = null
  }

  checkIsStandardAchievement() {
    return !this.isSpecialAchievement && !this.isDecree
  }
}

module.exports = {
  UltimateBaseCard,
}

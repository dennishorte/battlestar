module.exports = function() {
  this.id = 'Universe'
  this.name = 'Universe'
  this.exp = 'base'
  this.text = 'Have five top cards of value 8+.'
  this.alt = 'Astronmy'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetAge = reduceCost ? 7 : 8
    const targetCount = reduceCost ? 4 : 5
    const matchCount = game
      .utilColors()
      .map(color => (game.getTopCard(player, color) || {}).age)
      .filter(age => age >= targetAge)
      .length

    return matchCount >= targetCount
  }
}

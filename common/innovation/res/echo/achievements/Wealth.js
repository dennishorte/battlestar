module.exports = function() {
  this.id = 'Wealth'
  this.name = 'Wealth'
  this.exp = 'echo'
  this.text = 'Have eight visible bonuses on your board.'
  this.alt = 'Palampore'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetCount = reduceCost ? 7 : 8
    return game.getBonuses(player).length >= targetCount
  }
}

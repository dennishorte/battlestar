module.exports = function() {
  this.id = 'Empire'
  this.name = 'Empire'
  this.exp = 'base'
  this.text = 'Have three biscuits of each of the six biscuit types.'
  this.alt = 'Construction'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const biscuits = game.getBiscuitsByPlayer(player)
    const targetCount = reduceCost ? 2 : 3
    const targetBiscuitCount = reduceCost ? 5 : 6
    const numMatches = Object.values(biscuits).filter(count => count >= targetCount).length
    return numMatches >= targetBiscuitCount
  }
}

module.exports = function() {
  this.id = 'World'
  this.name = 'World'
  this.exp = 'base'
  this.text = 'Have twelve {i} on your board.'
  this.alt = 'Translation'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetInfo = reduceCost ? 11 : 12
    return game.getBiscuitsByPlayer(player).i >= targetInfo
  }
}

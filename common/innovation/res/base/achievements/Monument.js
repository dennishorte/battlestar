module.exports = function() {
  this.id = 'Monument'
  this.name = 'Monument'
  this.exp = 'base'
  this.text = 'Tuck or score six cards in one turn.'
  this.alt = 'Masonry'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const counts = game.state.monument[player.name] || {}
    const targetCount = reduceCost ? 5 : 6
    return counts.score >= targetCount || counts.tuck >= targetCount
  }
}

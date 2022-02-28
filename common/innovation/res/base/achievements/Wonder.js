module.exports = function() {
  this.id = 'Wonder'
  this.name = 'Wonder'
  this.exp = 'base'
  this.text = 'Have five colors splayed either up or right.'
  this.alt = 'Invention'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const numColors = reduceCost ? 4 : 5
    const splays = game
      .utilColors()
      .map(c => game.getZoneByPlayer(player, c).splay)

    const directionMatch = splays
      .filter(splay => splay === 'right' || splay === 'up')
      .length

    return directionMatch >= numColors
  }
}

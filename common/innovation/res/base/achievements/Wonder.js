module.exports = function() {
  this.id = 'Wonder'
  this.name = 'Wonder'
  this.exp = 'base'
  this.text = 'Have five colors splayed either up or right.'
  this.alt = 'Invention'
  this.checkPlayerIsEligible = function(game, player) {
    return game
      .utilColors()
      .map(c => game.getZoneColorByPlayer(player, c).splay)
      .every(splay => splay === 'right' || splay === 'up')
  }
}

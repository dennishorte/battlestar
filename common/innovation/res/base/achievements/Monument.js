module.exports = function() {
  this.id = 'Monument'
  this.name = 'Monument'
  this.exp = 'base'
  this.text = 'Tuck or score six cards in one turn.'
  this.alt = 'Masonry'
  this.checkPlayerIsEligible = function(game, player) {
    const counts = game.state.monument[player.name] || {}
    return counts.score >= 6 || counts.tuck >= 6
  }
}

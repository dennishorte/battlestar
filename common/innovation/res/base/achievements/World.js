module.exports = function() {
  this.id = 'World'
  this.name = 'World'
  this.exp = 'base'
  this.text = 'Have twelve {i} on your board.'
  this.alt = 'Translation'
  this.checkPlayerIsEligible = function(game, player) {
    return game.getBiscuits(player).board.i >= 12
  }
}

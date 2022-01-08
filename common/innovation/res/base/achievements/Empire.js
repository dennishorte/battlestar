module.exports = function() {
  this.id = 'Empire'
  this.name = 'Empire'
  this.exp = 'base'
  this.text = 'Have three biscuits of each of the six biscuit types.'
  this.alt = 'Construction'
  this.checkPlayerIsEligible = function(game, player) {
    player = game._adjustPlayerParam(player)
    const biscuits = game.getBiscuits(player)
    return Object.values(biscuits.final).every(count => count >= 3)
  }
}

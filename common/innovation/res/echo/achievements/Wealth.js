module.exports = function() {
  this.id = 'Wealth'
  this.name = 'Wealth'
  this.exp = 'echo'
  this.text = 'Have eight visible bonuses on your board.'
  this.alt = 'Palampore'
  this.checkPlayerIsEligible = function(game, player) {
    return game.getBonuses(player).length >= 8
  }
}

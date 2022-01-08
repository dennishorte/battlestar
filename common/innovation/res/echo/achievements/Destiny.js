module.exports = function() {
  this.id = 'Destiny'
  this.name = 'Destiny'
  this.exp = 'echo'
  this.text = 'Have seven cards forecasted'
  this.alt = 'Barometer'
  this.checkPlayerIsEligible = function(game, player) {
    return game.getForecast(player).cards.length >= 7
  }
}

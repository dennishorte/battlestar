module.exports = function() {
  this.id = 'Universe'
  this.name = 'Universe'
  this.exp = 'base'
  this.text = 'Have five top cards of value 8+.'
  this.alt = 'Astronmy'
  this.checkPlayerIsEligible = function(game, player) {
    return game
      .utilColors()
      .map(color => (game.getCardTop(player, color) || {}).age)
      .every(age => age >= 8)
  }
}

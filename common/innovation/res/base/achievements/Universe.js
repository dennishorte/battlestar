module.exports = function() {
  this.id = 'Universe'
  this.name = 'Universe'
  this.exp = 'base'
  this.text = 'Have five top cards of value 8+.'
  this.alt = 'Astronmy'
  this.triggerImpl = [
    {
      listen: ['board-changed'],
      func(game, event) {
      }
    },
  ],
  this.checkPlayerIsEligible = function(game, player) {
  }
}

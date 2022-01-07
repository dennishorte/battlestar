module.exports = function() {
  this.id = 'World'
  this.name = 'World'
  this.exp = 'base'
  this.text = 'Have twelve {i}.'
  this.alt = 'Translation'
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

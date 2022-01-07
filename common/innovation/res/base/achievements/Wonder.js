module.exports = function() {
  this.id = 'Wonder'
  this.name = 'Wonder'
  this.exp = 'base'
  this.text = 'Have five colors splayed either up or right.'
  this.alt = 'Invention'
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

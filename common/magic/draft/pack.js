module.exports = Pack

function Pack(game, data) {
  this.game = game

  this.owner = null
  this.waiting = null
  this.index = null  // Used for determining pass direction
  this.cards = data.cards
  this.picked = []
}

Pack.prototype.checkContainsCard = function(card) {
  return this.getRemainingCards().includes(card)
}

Pack.prototype.checkIsEmpty = function() {
  return this.getRemainingCards().length === 0
}

Pack.prototype.checkIsWaitingFor = function(player) {
  return this.waiting === player.name
}

Pack.prototype.getRemainingCards = function() {
  return this
    .cards
    .filter(card => !this.picked.includes(card))
}

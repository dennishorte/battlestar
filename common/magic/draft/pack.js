module.exports = Pack

function Pack(game, data) {
  this.game = game
  this.id = data.id

  this.owner = null
  this.waiting = null
  this.index = null  // Used for determining pass direction
  this.cards = data.cards.map(c => ({
    id: c,
    name: c,
    visibility: [],
  }))
  this.picked = []
}

Pack.prototype.checkCardIsAvailable = function(card) {
  return !this.picked.includes(card)
}

Pack.prototype.checkIsEmpty = function() {
  return this.getRemainingCards().length === 0
}

Pack.prototype.checkIsWaitingFor = function(player) {
  return this.waiting === player.name
}

Pack.prototype.getCardById = function(id) {
  return this.getRemainingCards().find(c => c.id === id)
}

Pack.prototype.getRemainingCards = function() {
  return this
    .cards
    .filter(card => !this.picked.includes(card))
}

module.exports = Zone


function Zone(game, name, kind) {
  this.id = name
  this.game = game
  this.name = name
  this.kind = kind
  this.owner = undefined
  this._cards = []
}

Zone.prototype.cards = function() {
  return [...this._cards]
}

Zone.prototype.getOwner = function() {
  return this.game.getPlayerByZone(this)
}

Zone.prototype.addCard = function(card) {
  this._cards.push(card)
}

Zone.prototype.setCards = function(cards) {
  this._cards = cards
}

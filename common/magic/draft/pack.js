const util = require('../../lib/util.js')


module.exports = Pack

function Pack(game, cards) {
  this.game = game

  this.id = null
  this.owner = null
  this.waiting = null
  this.index = null  // Used for determining pass direction

  this.cards = cards.map(c => {
    if (typeof c === 'string') {
      return {
        id: c,
        name: c,
        picker: null,
      }
    }
    else {
      return Object.assign({
        id: c.id,
        name: c.name,
        picked: null,
      }, c)
    }
  })
  this.picked = []
  this.knownCards = {}
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

Pack.prototype.getKnownCards = function(player) {
  return this.knownCards[player.name]
}

Pack.prototype.getKnownPickedCards = function(player) {
  const known = this.getKnownCards(player)
  return this.picked.filter(c => known.includes(c))
}

Pack.prototype.getPlayerPicks = function(player) {
  return this.cards.filter(c => c.picker === player)
}

Pack.prototype.pickCardById = function(player, cardId) {
  const card = this.cards.find(c => c.id === cardId)

  util.assert(Boolean(card), `Card with id=${cardId} not in this pack`)
  util.assert(!Boolean(card.picker), `Card with id=${cardId} is already picked`)

  card.picker = player
  this.picked.push(card)
}

// If this player has not viewed this pack before, take note of all unpicked cards.
// This is the set of cards that the player knows are in this pack.
Pack.prototype.viewPack = function(player) {
  if (player.name in this.knownCards === false) {
    this.knownCards[player.name] = this.getRemainingCards()
  }
}

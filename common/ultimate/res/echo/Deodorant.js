const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Deodorant`  // Card names are unique in Innovation
  this.name = `Deodorant`
  this.color = `yellow`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `c&ch`
  this.dogmaBiscuit = `c`
  this.echo = `Draw and meld a {3}.`
  this.karma = []
  this.dogma = [
    `If you have a top card with {k}, draw and meld a {3}. Otherwise, draw a {4}.`,
    `If you have a top card with {f}, junk all cards in the {4} deck.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hasTopWithCastle = game
        .getTopCards(player)
        .some(card => card.checkHasBiscuit('k'))
      if (hasTopWithCastle) {
        game.aDrawAndMeld(player, game.getEffectAge(this, 3))
      }
      else {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
    },

    (game, player) => {
      const topCardsWithFactory = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('f'))
        .length

      if (topCardsWithFactory > 0) {
        game.aJunkDeck(player, game.getEffectAge(this, 4))
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 3))
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `El Dorado`  // Card names are unique in Innovation
  this.name = `El Dorado`
  this.color = `green`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3}, a {2}, and a {1}. If all three cards have {c}, score all cards in the {5} deck. If at least two have {c}, splay your green and blue cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      // Draw and meld the three cards
      const card3 = game.aDrawAndMeld(player, game.getEffectAge(this, 3))
      const card2 = game.aDrawAndMeld(player, game.getEffectAge(this, 2))
      const card1 = game.aDrawAndMeld(player, game.getEffectAge(this, 1))

      const crownCount = [card3, card2, card1].filter(card => card.checkHasBiscuit('c')).length

      if (crownCount === 3) {
        game.aScoreMany(player, game.getZoneByDeck('base', 5).cards(), { ordered: true })
      }

      if (crownCount >= 2) {
        game.aSplay(player, 'green', 'right')
        game.aSplay(player, 'blue', 'right')
      }
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

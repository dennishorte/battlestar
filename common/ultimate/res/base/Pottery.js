const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pottery`  // Card names are unique in Innovation
  this.name = `Pottery`
  this.color = `blue`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand. If you returned any cards, draw and score a card of value equal to the number of cards you returned.`,
    `Draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(
        player,
        game.getCardsByZone(player, 'hand'),
        { min: 0, max: 3 }
      )

      if (cards && cards.length > 0) {
        game.aDrawAndScore(player, cards.length)
      }
    },

    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 1) })
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

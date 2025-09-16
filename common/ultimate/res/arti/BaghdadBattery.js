const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Baghdad Battery`  // Card names are unique in Innovation
  this.name = `Baghdad Battery`
  this.color = `green`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `cshc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld two cards from your hand. If you melded two of the same color and they are of different type, draw and score five {2}s.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'), { count: 2 })

      if (
        cards
        && cards.length === 2
        && cards[0].color === cards[1].color
        && cards[0].expansion !== cards[1].expansion
      ) {
        for (let i = 0; i < 5; i++) {
          game.aDrawAndScore(player, game.getEffectAge(this, 2))
        }
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

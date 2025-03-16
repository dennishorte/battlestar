const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seikilos Epitaph`  // Card names are unique in Innovation
  this.name = `Seikilos Epitaph`
  this.color = `blue`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3}. Meld your bottom card of the drawn card's color. Execute its non-demand dogma effects. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 3))
      if (card) {
        const cards = game.getCardsByZone(player, card.color)
        const toMeld = cards[cards.length - 1]
        const melded = game.aMeld(player, toMeld)
        if (melded) {
          game.aCardEffects(player, melded, 'dogma')
        }
      }
    }
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

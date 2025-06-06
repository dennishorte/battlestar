const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Genetics`  // Card names are unique in Innovation
  this.name = `Genetics`
  this.color = `blue`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {e}. Score all cards beneath it.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 11))
      if (card) {
        const cards = game.getCardsByZone(player, card.color)
        const cardIndex = cards.indexOf(card)
        if (cardIndex === -1) {
          game.log.add({
            template: '{card} is not in its stack',
            args: { card }
          })
        }
        else {
          game.aScoreMany(player, cards.slice(cardIndex + 1), { ordered: true })
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

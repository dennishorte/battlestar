const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Physics`  // Card names are unique in Innovation
  this.name = `Physics`
  this.color = `blue`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `fssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw three {6} and reveal them. If two or more of the drawn cards are the same color, return the drawn cards and all card in your hand. Otherwise, keep them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card1 = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      const card2 = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      const card3 = game.aDrawAndReveal(player, game.getEffectAge(this, 6))

      if (card1.color === card2.color || card2.color === card3.color || card3.color === card1.color) {
        game.mLog({
          template: 'Two or more of the cards had the same color'
        })
        game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      }
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

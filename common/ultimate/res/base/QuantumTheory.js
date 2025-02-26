const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quantum Theory`  // Card names are unique in Innovation
  this.name = `Quantum Theory`
  this.color = `blue`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return up to two cards from your hand. If you return two, draw a {0} and then draw and score a {0}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(
        player,
        game.getCardsByZone(player, 'hand'),
        { min: 0, max: 2 }
      )

      if (returned && returned.length == 2) {
        game.aDraw(player, { age: game.getEffectAge(this, 10) })
        game.aDrawAndScore(player, game.getEffectAge(this, 10))
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

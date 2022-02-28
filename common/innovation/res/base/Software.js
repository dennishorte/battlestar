const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Software`  // Card names are unique in Innovation
  this.name = `Software`
  this.color = `blue`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a {0}.`,
    `Draw and meld two {0}, then execute each of the second card's non-demand dogma effects. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
    },
    (game, player) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      game.mLog({
        template: '{player} will execute {card}',
        args: { player, card }
      })
      game.aCardEffects(player, player, card, 'dogma', game.getBiscuits())
    },
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

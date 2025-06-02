const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Software`  // Card names are unique in Innovation
  this.name = `Software`
  this.color = `blue`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `ipih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a {0}.`,
    `Draw and meld two {9}, then self-execute the second card.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
    },
    (game, player) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 9))
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 9))
      game.log.add({
        template: '{player} will execute {card}',
        args: { player, card }
      })
      game.aCardEffects(player, card, 'dogma')
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

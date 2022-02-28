const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Robotics`  // Card names are unique in Innovation
  this.name = `Robotics`
  this.color = `red`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hfif`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score your top green card.`,
    `Draw and meld a {0}, then execute each of its non-demand dogma effects. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aScore(player, game.getTopCard(player, 'green'))
    },
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 10))
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Robotics`  // Card names are unique in Innovation
  this.name = `Robotics`
  this.color = `red`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hfpf`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score your top green card.`,
    `Draw and meld a {0}. If it has a {f} or {i}, self-execute it.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aScore(player, game.getTopCard(player, 'green'))
    },
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      if (card.checkHasBiscuit('f') || card.checkHasBiscuit('i')) {
        game.aSelfExecute(player, card)
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

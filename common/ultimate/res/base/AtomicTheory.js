const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Atomic Theory`  // Card names are unique in Innovation
  this.name = `Atomic Theory`
  this.color = `blue`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your blue cards right.`,
    `Draw and meld a {7}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    },

    (game, player) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 7))
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

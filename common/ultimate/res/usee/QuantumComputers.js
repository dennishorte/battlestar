const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quantum Computers`  // Card names are unique in Innovation
  this.name = `Quantum Computers`
  this.color = `blue`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `iihi`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you flip a coin! If you lose the flip, you lose!`,
    `Flip a coin. If you win the flip, this effect is complete. If you lose the flip, return one of your secrets. If you don't, you lose. Otherwise, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {

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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Espionage`  // Card names are unique in Innovation
  this.name = `Espionage`
  this.color = `blue`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal a card in your hand. If you do, and I have no card in my hand of the same color, transfer it to my hand, then repeat this effect!`
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

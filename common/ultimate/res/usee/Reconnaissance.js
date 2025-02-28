const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Reconnaissance`  // Card names are unique in Innovation
  this.name = `Reconnaissance`
  this.color = `blue`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `fhfs`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand!`,
    `Draw and reveal three {6}. Return two of the drawn cards. You may splay the color of the card not returned right.`
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

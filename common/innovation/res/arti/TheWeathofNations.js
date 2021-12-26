const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `The Weath of Nations`
  this.color = `green`
  this.age = 6
  this.biscuits = `cfhc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and score a {1}. Add up the values of all the cards in your score pile, divide by five, and round up. Draw and score a card of value equal to the result.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

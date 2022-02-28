const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jeans`  // Card names are unique in Innovation
  this.name = `Jeans`
  this.color = `green`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `&lh8`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw two {9}. Return one, foreshadow the other.`
  this.karma = []
  this.dogma = [
    `Choose two different values less than {7}. Draw and reveal a card of each value. Meld one, and return the other.`
  ]

  this.dogmaImpl = []
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

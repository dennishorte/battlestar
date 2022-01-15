const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dice`  // Card names are unique in Innovation
  this.name = `Dice`
  this.color = `blue`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `h1cc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {1}. If the card has a bonus, draw and meld a card of value equal to its bonus.`
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

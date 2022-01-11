const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Puffing Billy`  // Card names are unique in Innovation
  this.name = `Puffing Billy`
  this.color = `blue`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Draw a card of value equal to the highest number of symbols of the same type visible in that color on your board. Splay right that color.`
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

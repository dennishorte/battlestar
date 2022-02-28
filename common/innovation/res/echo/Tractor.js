const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tractor`  // Card names are unique in Innovation
  this.name = `Tractor`
  this.color = `yellow`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `&iih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw a {7}.`
  this.karma = []
  this.dogma = [
    `Draw and score a {7}. Draw a {7}.`
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

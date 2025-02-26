const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Munich`  // Card names are unique in Innovation
  this.name = `Munich`
  this.color = `blue`
  this.age = 7
  this.expansion = `city`
  this.biscuits = `si+s>h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = []

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

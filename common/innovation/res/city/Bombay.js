const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bombay`  // Card names are unique in Innovation
  this.name = `Bombay`
  this.color = `green`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `6cll>h`
  this.dogmaBiscuit = `l`
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

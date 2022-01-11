const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ocean Liner Titanic`  // Card names are unique in Innovation
  this.name = `Ocean Liner Titanic`
  this.color = `green`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `cfch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score all bottom cards from your board.`
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

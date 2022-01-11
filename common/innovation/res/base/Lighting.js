const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Lighting`  // Card names are unique in Innovation
  this.name = `Lighting`
  this.color = `purple`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hlil`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck up to three cards from your hand. If you do, draw and score a {7} for every different value of card you tucked.`
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

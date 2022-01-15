const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bell`  // Card names are unique in Innovation
  this.name = `Bell`
  this.color = `purple`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `khk&`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `You may score a card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {2}.`
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

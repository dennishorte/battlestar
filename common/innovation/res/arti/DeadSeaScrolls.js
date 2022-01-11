const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dead Sea Scrolls`  // Card names are unique in Innovation
  this.name = `Dead Sea Scrolls`
  this.color = `purple`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `hksk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw an Artifact of value equal to the value of your highest top card.`
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

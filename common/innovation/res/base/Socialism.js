const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Socialism`  // Card names are unique in Innovation
  this.name = `Socialism`
  this.color = `purple`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `lhll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck all cards from your hand. If you tuck one, you must tuck them all. If you tucked at least one purple card, take all the lowest cards in each opponent's hand into your hand.`
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

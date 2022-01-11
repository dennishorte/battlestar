const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Suburbia`  // Card names are unique in Innovation
  this.name = `Suburbia`
  this.color = `yellow`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hcll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck any number of cards from your hand. Draw and score a {1} for each card you tucked.`
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

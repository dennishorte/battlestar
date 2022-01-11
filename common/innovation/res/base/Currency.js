const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Currency`  // Card names are unique in Innovation
  this.name = `Currency`
  this.color = `green`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `lchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. If you do, draw and score a {2} for every different value of card you returned.`
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

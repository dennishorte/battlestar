const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Soap`  // Card names are unique in Innovation
  this.name = `Soap`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `l2hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. You may tuck any number of cards of that color from your hand. If you tucked at least three, you may achieve (if eligible) a card from your hand.`
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

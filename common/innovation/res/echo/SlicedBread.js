const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sliced Bread`  // Card names are unique in Innovation
  this.name = `Sliced Bread`
  this.color = `green`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `&h9c`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Return all cards from your hand and draw two {8}.`
  this.karma = []
  this.dogma = [
    `Return a card from your score pile. Draw and score two cards of value one less than the value of the card returned.`
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

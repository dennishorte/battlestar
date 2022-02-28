const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Steamboat`  // Card names are unique in Innovation
  this.name = `Steamboat`
  this.color = `green`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `h6cc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a {6}! If it is blue or yellow, transfer it and all cards in your hand to my hand! If it is red or green, keep it and transfer two cards from your score pile to mine! If it is purple, keep it!`
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

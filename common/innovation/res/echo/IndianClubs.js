const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Indian Clubs`  // Card names are unique in Innovation
  this.name = `Indian Clubs`
  this.color = `purple`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `hl6l`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return two cards from your score pile!`,
    `For every value of card you have in your score pile, score a card from your hand of that value.`
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

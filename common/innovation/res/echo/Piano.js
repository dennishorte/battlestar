const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Piano`  // Card names are unique in Innovation
  this.name = `Piano`
  this.color = `purple`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `5&hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a card of a value present in any player's hand.`
  this.karma = []
  this.dogma = [
    `If you have five top cards, each with a different value, return five cards from your score pile and then draw and score a card of each of your top cards' values in ascending order.`
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

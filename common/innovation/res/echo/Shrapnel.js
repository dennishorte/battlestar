const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shrapnel`  // Card names are unique in Innovation
  this.name = `Shrapnel`
  this.color = `red`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and tuck a {6}! Transfer the top two cards of its color from your board to my score pile! Transfer the bottom card of its color from my board to your score pile!`
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

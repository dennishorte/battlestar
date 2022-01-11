const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Frigate Constitution`  // Card names are unique in Innovation
  this.name = `Frigate Constitution`
  this.color = `red`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to reveal a card in your hand! If you do, and its value is equal to the value of any of my top cards, return it and all cards of its color from your board.`
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

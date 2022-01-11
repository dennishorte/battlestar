const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dunhuang Star Chart`  // Card names are unique in Innovation
  this.name = `Dunhuang Star Chart`
  this.color = `blue`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. Draw a card of value equal to the number of cards returned.`
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

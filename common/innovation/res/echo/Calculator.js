const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Calculator`  // Card names are unique in Innovation
  this.name = `Calculator`
  this.color = `blue`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `ihis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score two bottom non-blue cards from your board. If you scored two cards and they have a total value less than 11, draw a card of that total value and repeat this dogma effect (only once).`,
    `You may splay your blue cards up.`
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

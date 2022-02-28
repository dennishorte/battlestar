const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Loom`  // Card names are unique in Innovation
  this.name = `Loom`
  this.color = `red`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `f6h&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Score your lowest top card.`
  this.karma = []
  this.dogma = [
    `You may return two cards of different value from your score pile. If you do, draw and tuck three {6}.`,
    `If you have five or more HEX visible on your board in one color, claim the Heritage achievement.`
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

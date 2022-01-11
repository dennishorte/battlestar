const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seikan Tunnel`  // Card names are unique in Innovation
  this.name = `Seikan Tunnel`
  this.color = `green`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have the most cards of a color showing on your board out of all colors on all boards, you win.`
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

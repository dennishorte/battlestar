const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Where's Waldo`  // Card names are unique in Innovation
  this.name = `Where's Waldo`
  this.color = `yellow`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `lihl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You win.`
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

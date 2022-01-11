const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seikilos Epitaph`  // Card names are unique in Innovation
  this.name = `Seikilos Epitaph`
  this.color = `blue`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3}. Meld your bottom card of the drawn card's color. Execute its non-demand dogma effects. Do not share them.`
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

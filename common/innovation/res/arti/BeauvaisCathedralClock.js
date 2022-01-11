const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Beauvais Cathedral Clock`  // Card names are unique in Innovation
  this.name = `Beauvais Cathedral Clock`
  this.color = `green`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {4}. Splay right the color matching the drawn card.`
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

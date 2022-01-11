const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dolly the Sheep`  // Card names are unique in Innovation
  this.name = `Dolly the Sheep`
  this.color = `yellow`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `hili`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score your bottom yellow card. You may draw and tuck a {1}. If your bottom yellow card is Domestication, you win. Otherwise, meld the higest card in your hand, then draw a {0}.`
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

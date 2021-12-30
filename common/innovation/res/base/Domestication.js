const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Domestication`  // Card names are unique in Innovation
  this.name = `Domestication`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kchk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Meld the lowest card in your hand. Draw a {1}.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

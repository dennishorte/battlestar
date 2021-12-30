const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Flight`  // Card names are unique in Innovation
  this.name = `Flight`
  this.color = `red`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `chic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `If your red cards are splayed up, you may splay any one color of your cards up.`,
    `You may splay your red cards up.`
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

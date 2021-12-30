const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Specialization`  // Card names are unique in Innovation
  this.name = `Specialization`
  this.color = `purple`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hflf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Reveal a card from your hand. Take into your hand the top card of that color from all opponents' boards.`,
    `You may splay your yellow or blue cards up.`
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

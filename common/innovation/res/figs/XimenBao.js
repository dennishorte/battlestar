const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Ximen Bao`
  this.color = `yellow`
  this.age = 2
  this.biscuits = `*2hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.triggers = [
    `You may issue an Expansion Decree with any two figures.`,
    `Each Inspire and Echo effect on your board counts as a part of this stack. When executing, order them from bottom to top, red, blue, green, purple, yellow.`
  ]
  this.dogma = []

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
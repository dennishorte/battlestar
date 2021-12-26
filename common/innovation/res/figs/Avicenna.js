const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Avicenna`
  this.color = `yellow`
  this.age = 3
  this.biscuits = `*lhl`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and tuck a {3}.`
  this.echo = ``
  this.triggers = [
    `You may issue an Expansion Decree with any two figures.`,
    `If you are required to fade a figure, instead do nothing.`
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
const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Christopher Polhem`
  this.color = `yellow`
  this.age = 5
  this.biscuits = `hff*`
  this.dogmaBiscuit = `f`
  this.inspire = `Draw and tuck a {4}.`
  this.echo = ``
  this.triggers = [
    `You may issue an Expansion Decree with any two figures.`,
    `Each {f} on your board provides two additional points towards your score.`
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

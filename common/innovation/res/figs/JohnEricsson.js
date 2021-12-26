const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `John Ericsson`
  this.color = `red`
  this.age = 7
  this.biscuits = `hff*`
  this.dogmaBiscuit = `f`
  this.inspire = `Draw and tuck a {7}.`
  this.echo = ``
  this.triggers = [
    `When you meld this card, score all opponents' top figures of value less than 7.`,
    `Each {f} on your board provides two additional {i}.`
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

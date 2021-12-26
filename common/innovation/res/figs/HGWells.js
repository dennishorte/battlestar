const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `H.G. Wells`
  this.color = `purple`
  this.age = 8
  this.biscuits = `l*hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and foreshadow a {0}.`
  this.echo = ``
  this.triggers = [
    `If you would foreshadow a card, instead meld it, execute its non-demand Dogma effects for yourself only, and remove it from the game if it is still a top card on your board.`
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
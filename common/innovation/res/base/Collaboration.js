const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Collaboration`
  this.color = `green`
  this.age = 9
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you draw two {9} and reveal them! Transfer the card of my choice to my board, and meld the other!`,
    `If you have ten or more green cards on your board, you win.`
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

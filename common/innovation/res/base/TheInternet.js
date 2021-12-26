const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `The Internet`
  this.color = `purple`
  this.age = 10
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may splay your green cards up.`,
    `Draw and score a {0}.`,
    `Draw and meld a {0} for every two {i} on your board.`
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
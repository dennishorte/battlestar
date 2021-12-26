const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `James Clerk Maxwell`
  this.color = `blue`
  this.age = 7
  this.biscuits = `h*7i`
  this.dogmaBiscuit = `i`
  this.inspire = `Draw an {8}.`
  this.echo = ``
  this.triggers = [
    `Each card in hand provides one additional icon of every type on your board.`
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

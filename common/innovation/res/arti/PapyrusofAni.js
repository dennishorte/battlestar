const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Papyrus of Ani`
  this.color = `red`
  this.age = 1
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Return a purple card from your hand. If you do, draw and reveal a card of any type of value two higher. If the drawn card is purple, meld is and execute each of its non-demand dogma effects. Do not share them.`
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

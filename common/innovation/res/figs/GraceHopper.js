const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Grace Hopper`
  this.color = `blue`
  this.age = 9
  this.biscuits = `sh9*`
  this.dogmaBiscuit = `s`
  this.inspire = `Tuck two cards from your hand.`
  this.echo = ``
  this.triggers = [
    `If another player would not draw a card for sharing after a Dogma action, first draw and reveal a {0}. If it is blue, you win.`
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

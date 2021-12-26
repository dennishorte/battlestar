const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Electrum Stater of Efesos`
  this.color = `green`
  this.age = 1
  this.biscuits = `chkc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and reveal a {3}. If you do not have a top card of the drawn card's color, meld it and repeat this dogma effect.`
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

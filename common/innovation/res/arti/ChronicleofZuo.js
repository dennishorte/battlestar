const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Chronicle of Zuo`
  this.color = `red`
  this.age = 2
  this.biscuits = `chss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `If you have the least {k}, draw a {2}. If you have the least {c}, draw a {3}. If you have the least {s}, draw a {4}.`
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

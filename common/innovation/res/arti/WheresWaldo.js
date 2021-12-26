const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Where's Waldo`
  this.color = `yellow`
  this.age = 10
  this.biscuits = `lihl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You win.`
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

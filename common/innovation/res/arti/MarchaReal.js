const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Marcha Real`
  this.color = `purple`
  this.age = 6
  this.biscuits = `llhc`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Reveal and return two cards from your hand. If they have the same value, draw a card of value one higher. If they have the same color, claim and achievement, ignoring elibility.`
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
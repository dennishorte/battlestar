const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = ``
  this.color = ``
  this.age = 
  this.biscuits = ``
  this.dogmaBiscuit = ``
  this.inspire = ``
  this.echo = ``
  this.triggers = []
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

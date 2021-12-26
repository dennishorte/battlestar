const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `United Nations Charter`
  this.color = `red`
  this.age = 9
  this.biscuits = `hlil`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to transfer all top cards on your board with a demand effect to my score pile!`,
    `If you have a top card on your board with a demand effect, draw a {0}.`
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
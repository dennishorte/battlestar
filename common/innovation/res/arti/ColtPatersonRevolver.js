const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Colt Paterson Revolver`
  this.color = `yellow`
  this.age = 7
  this.biscuits = `fhfc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to reveal your hand! Draw a {7}! If the color of the drawn card matches the color of any other card in your hand, return all cards in your hand and all cards in your score pile!`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Maldives`
  this.color = `red`
  this.age = 10
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to return all cards in your hand but two! Return all cards in your score pile but two!`,
    `Return all cards in your score pile but four.`
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

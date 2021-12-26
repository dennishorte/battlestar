const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Petition of Right`
  this.color = `blue`
  this.age = 4
  this.biscuits = `shcs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to transfer a card from your score pile to my score pile for each top card with a {k} on your board.`
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

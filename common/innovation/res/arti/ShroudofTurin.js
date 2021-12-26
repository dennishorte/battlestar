const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Shroud of Turin`
  this.color = `purple`
  this.age = 3
  this.biscuits = `lhll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Return a card from your hand. If you do, return a top card from your board and a card from your score pile of the returned card's color. If you did all three, claim an achievement ignoring eligibility.`
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
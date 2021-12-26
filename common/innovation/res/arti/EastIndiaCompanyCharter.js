const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `East India Company Charter`
  this.color = `red`
  this.age = 4
  this.biscuits = `cffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Choose a value other than {5}. Return all cards of that value from all score piles. For each player that returned cards, draw and score a {5}.`
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

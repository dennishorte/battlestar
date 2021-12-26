const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `The Communist Manifesto`
  this.color = `purple`
  this.age = 7
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `For each player in the game, draw and reveal a {7}. Transfer one of the drawn cards to each player's board. Execute the non-demand dogma effects of your card. Do not share them.`
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

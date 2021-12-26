const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Ludwig Van Beethoven`
  this.color = `purple`
  this.age = 6
  this.biscuits = `h*7c`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.triggers = [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would score a card with a {s}, instead return it and all cards from your score pile, then draw and score four {5}.`
  ]
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

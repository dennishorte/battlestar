const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Isaac Newton`
  this.color = `blue`
  this.age = 5
  this.biscuits = `hs&s`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Splay one color of your cards right.`
  this.triggers = [
    `If you would take a Draw or Inspire action, first draw a {1} and transfer it to any player's board.`
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
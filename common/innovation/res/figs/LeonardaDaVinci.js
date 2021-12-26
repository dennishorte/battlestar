const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Leonarda Da Vinci`
  this.color = `yellow`
  this.age = 4
  this.biscuits = `&5hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score a top figure with a bonus from anywhere.`
  this.triggers = [
    `If you would meld a yellow card, first meld every non-yellow, non-purple card in your hand.`,
    `If you would meld a purple card, first draw three {4}.`
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

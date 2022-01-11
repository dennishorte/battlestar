const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Leonarda Da Vinci`  // Card names are unique in Innovation
  this.name = `Leonarda Da Vinci`
  this.color = `yellow`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `&5hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score a top figure with a bonus from anywhere.`
  this.karma = [
    `If you would meld a yellow card, first meld every non-yellow, non-purple card in your hand.`,
    `If you would meld a purple card, first draw three {4}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

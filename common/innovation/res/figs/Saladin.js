const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Saladin`
  this.color = `red`
  this.age = 3
  this.biscuits = `3h&k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Score any other top card with a {k} from anywhere.`
  this.triggers = [
    `You may issue a War Decree with any two figures.`,
    `If you would score a non-figure card, instead meld the card, then you may splsy left the color of that card.`
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

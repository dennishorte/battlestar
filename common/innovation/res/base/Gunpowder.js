const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Gunpowder`
  this.color = `red`
  this.age = 4
  this.biscuits = `hfcf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer a top card with a {k} from your board to my score pile!`,
    `If any card was transferred due to the demand, draw and score a {2}.`
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

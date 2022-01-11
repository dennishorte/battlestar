const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gunpowder`  // Card names are unique in Innovation
  this.name = `Gunpowder`
  this.color = `red`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hfcf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card with a {k} from your board to my score pile!`,
    `If any card was transferred due to the demand, draw and score a {2}.`
  ]

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

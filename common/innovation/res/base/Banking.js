const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Banking`  // Card names are unique in Innovation
  this.name = `Banking`
  this.color = `green`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `fchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top non-green card with a {f} from your board to my board. If you do, draw and score a {5}.`,
    `You may splay your green cards right.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Enterprise`  // Card names are unique in Innovation
  this.name = `Enterprise`
  this.color = `purple`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top non-purple card with a {c} from your board to my board. If you do, draw and meld a {4}.`,
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

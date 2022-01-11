const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Feudalism`  // Card names are unique in Innovation
  this.name = `Feudalism`
  this.color = `purple`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hklk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, unsplay that color of your cards!`,
    `You may splay your yellow or purple cards left.`
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

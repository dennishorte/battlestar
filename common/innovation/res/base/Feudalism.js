const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Feudalism`
  this.color = `purple`
  this.age = 3
  this.biscuits = `hklk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, unsplay that color of your cards!`,
    `You may splay your yellow or purple cards left.`
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

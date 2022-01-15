const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Candles`  // Card names are unique in Innovation
  this.name = `Candles`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `&1hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `If every other player has a higher score than you, draw a {3}.`
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, draw a {1}!`
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

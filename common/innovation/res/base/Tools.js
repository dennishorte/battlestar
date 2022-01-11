const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tools`  // Card names are unique in Innovation
  this.name = `Tools`
  this.color = `blue`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return three cards from your hand. If you do, draw and meld a {3}.`,
    `You may return a {3} from your hand. If you do, draw and meld three {1}.`
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

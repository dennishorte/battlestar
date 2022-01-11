const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sunshu Ao`  // Card names are unique in Innovation
  this.name = `Sunshu Ao`
  this.color = `yellow`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `h1*k`
  this.dogmaBiscuit = `k`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would tuck a yellow card, instead execute all of the non-demand Dogma effects on it for yourself only, then return it to your hand.`
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

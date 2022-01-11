const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Al-Kindi`  // Card names are unique in Innovation
  this.name = `Al-Kindi`
  this.color = `purple`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `hcc*`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would draw a card for sharing, first draw two cards of the same value.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alfred Nobel`  // Card names are unique in Innovation
  this.name = `Alfred Nobel`
  this.color = `green`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `chc*`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `Each icon type on your board counts as an achievement, if you have at least twice as many of that icon as every other player.`
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

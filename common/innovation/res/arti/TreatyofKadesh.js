const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Treaty of Kadesh`  // Card names are unique in Innovation
  this.name = `Treaty of Kadesh`
  this.color = `blue`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `ckhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return all top cards from your board with a demand effect!`,
    `Score a top, non-blue card from your board with a demand effect.`
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

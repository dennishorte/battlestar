const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seed Drill`  // Card names are unique in Innovation
  this.name = `Seed Drill`
  this.color = `green`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `sllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a top card from your board of value less than {3}!`,
    `Choose the {3}, {4}, or {5} deck. If there is at least one card in that deck, you may transfer its bottom card to the available achievements.`
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

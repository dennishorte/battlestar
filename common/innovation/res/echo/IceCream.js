const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ice Cream`  // Card names are unique in Innovation
  this.name = `Ice Cream`
  this.color = `purple`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `h8l&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score a non-purple top card from your board without a bonus.`
  this.karma = []
  this.dogma = [
    `I demand you draw and meld a {1}!`,
    `Choose the {6}, {7}, {8}, or {9} deck. If there is at least one card in that deck, you may transfer its bottom card to the available achievements.`
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

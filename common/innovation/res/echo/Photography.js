const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Photography`  // Card names are unique in Innovation
  this.name = `Photography`
  this.color = `blue`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `&sh7`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld a card from your forecast.`
  this.karma = []
  this.dogma = [
    `I demand you take the highest top card from your board into your hand.`,
    `If you have at least three echo effects visible in one color, claim the History achievement.`
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

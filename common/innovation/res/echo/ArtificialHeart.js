const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Artificial Heart`  // Card names are unique in Innovation
  this.name = `Artificial Heart`
  this.color = `blue`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `hllb`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Claim on standard achievement, if eligible. Your current score is doubled for the purpose of checking eligibility.`
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

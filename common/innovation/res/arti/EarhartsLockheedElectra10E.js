const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Earhart's Lockheed Electra 10E`  // Card names are unique in Innovation
  this.name = `Earhart's Lockheed Electra 10E`
  this.color = `blue`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each value below nine, return a top card of that value from your board, in descending order. If you return eight cards, you win. Otherwise, claim an achievement, ignoring eligibility.`
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

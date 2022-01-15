const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chopsticks`  // Card names are unique in Innovation
  this.name = `Chopsticks`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hll&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw a {1}.`
  this.karma = []
  this.dogma = [
    `If the {1} deck has at least one card, you may transfer its bottom card to the available achievements.`
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

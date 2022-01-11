const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Translation`  // Card names are unique in Innovation
  this.name = `Translation`
  this.color = `blue`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may meld all the cards in your score pile. If you meld one, you must meld them all.`,
    `If each top card on your board has a {c}, claim the World achievement.`
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

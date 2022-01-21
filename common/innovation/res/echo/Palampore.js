const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Palampore`  // Card names are unique in Innovation
  this.name = `Palampore`
  this.color = `green`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `fhf5`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a card of value equal to a bonus that occurs more than once on your board, if you have such a bonus.`,
    `You may splay your purple cards right.`,
    `If you have six or more bonuses on your board, claim the Wealth achievement.`
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

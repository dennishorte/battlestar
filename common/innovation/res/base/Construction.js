const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Construction`  // Card names are unique in Innovation
  this.name = `Construction`
  this.color = `red`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer two cards from your hand to my hand! Draw a {2}!`,
    `If you are the only player with five top cards, claim the Empire achievement.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

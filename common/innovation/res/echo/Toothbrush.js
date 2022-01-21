const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Toothbrush`  // Card names are unique in Innovation
  this.name = `Toothbrush`
  this.color = `yellow`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `2&hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Tuck all cards of one present value from your hand.`
  this.karma = []
  this.dogma = [
    `You may splay any one color of your cards left.`,
    `If the {2} deck has at least one card, you may transfer its bottom card to the available achievements.`
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

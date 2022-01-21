const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sunglasses`  // Card names are unique in Innovation
  this.name = `Sunglasses`
  this.color = `purple`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `h3&k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Score a card from your hand of a color you have splayed.`
  this.karma = []
  this.dogma = [
    `You may either splay your purple cards in the direction one of your other colors is splayed, or you may splay one of your other colors in the direction that your purple cars are splayed.`
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

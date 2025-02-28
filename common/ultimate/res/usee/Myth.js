const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Myth`  // Card names are unique in Innovation
  this.name = `Myth`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have two cards of the same color in your hand, tuck them both. If you do, splay left that color, and draw and safeguard a card of value equal to the value of your bottom card of that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
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

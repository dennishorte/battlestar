const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Flash Drive`  // Card names are unique in Innovation
  this.name = `Flash Drive`
  this.color = `green`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `ffhf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return four cards from your score pile.`,
    `Return a card from your score pile. If you do, you may splay any one color of your cards up.`
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

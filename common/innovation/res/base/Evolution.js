const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Evolution`  // Card names are unique in Innovation
  this.name = `Evolution`
  this.color = `blue`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may bhoose to either rdraw and score and {8} and then return a card from your score pile, or draw a card of value one higher than the highest card in your score pile.`
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

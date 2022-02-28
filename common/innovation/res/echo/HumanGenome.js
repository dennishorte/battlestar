const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Human Genome`  // Card names are unique in Innovation
  this.name = `Human Genome`
  this.color = `blue`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `ssah`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may draw and score a card of any value. Take a bottom card from your board into your hand. If the values of all the cards in your hand match the values of all the card in your score pile, exactly, you win.`
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

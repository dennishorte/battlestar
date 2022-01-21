const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Scissors`  // Card names are unique in Innovation
  this.name = `Scissors`
  this.color = `green`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `&h2k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Take a bottom card from your board into your hand.`
  this.karma = []
  this.dogma = [
    `You may choose up to two cards from your hand. For each card chosen, either meld it or score it.`,
    `If Paper is a top card on any player's board, transfer it to your score pile.`
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

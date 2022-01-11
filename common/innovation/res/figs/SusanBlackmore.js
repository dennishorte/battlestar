const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Susan Blackmore`  // Card names are unique in Innovation
  this.name = `Susan Blackmore`
  this.color = `blue`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `*shs`
  this.dogmaBiscuit = `s`
  this.inspire = `Execute any echo or inspire effect.`
  this.echo = ``
  this.karma = [
    `If another player would not draw a share bonus after a Dogma action, first transfer the card they activated to your score pile.`
  ]
  this.dogma = []

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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ark of the Covenant`  // Card names are unique in Innovation
  this.name = `Ark of the Covenant`
  this.color = `purple`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Transfer all cards of the same color from the boards of all players with no top Artifacts to your score pile. If Ark of the Covenant is a top card on any board, transfer it to your hand.`
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

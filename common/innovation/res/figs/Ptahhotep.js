const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ptahhotep`  // Card names are unique in Innovation
  this.name = `Ptahhotep`
  this.color = `purple`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `h*kk`
  this.dogmaBiscuit = `k`
  this.inspire = `Score a top card from your board.`
  this.echo = ``
  this.karma = [
    `If a player would successfully demand something of you, first transfer the highest card from that player's score pile to your score pile.`
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

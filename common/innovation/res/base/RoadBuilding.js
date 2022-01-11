const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Road Building`  // Card names are unique in Innovation
  this.name = `Road Building`
  this.color = `red`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld one or two cards from your hand. If you melded two, you may transfer your top red card to another player's board. If you do, transfer that player's top green card to your board.`
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

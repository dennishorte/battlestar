const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mask of Warka`  // Card names are unique in Innovation
  this.name = `Mask of Warka`
  this.color = `purple`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. Each player reveals all cards of that color from their hand. If you are the only player to reveal cards, return them and claim all achievements of value matching those cards, ignoring eligibility.`
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

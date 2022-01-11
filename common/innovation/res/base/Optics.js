const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Optics`  // Card names are unique in Innovation
  this.name = `Optics`
  this.color = `red`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {3}. If it has a {c}, draw and score a {4}. Otherwise, transfer a card from your score pile to the score pile of an opponent with fewer points than you.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Zhang Heng`  // Card names are unique in Innovation
  this.name = `Zhang Heng`
  this.color = `blue`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `l&2h`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and tuck a {3}. Score all cards above it.`
  this.karma = [
    `Each card in your score pile counts as a bonus of its value on your board.`
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

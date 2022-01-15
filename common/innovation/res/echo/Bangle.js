const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bangle`  // Card names are unique in Innovation
  this.name = `Bangle`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hk&1`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Tuck a red card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {2}.`
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

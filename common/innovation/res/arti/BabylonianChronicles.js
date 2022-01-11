const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Babylonian Chronicles`  // Card names are unique in Innovation
  this.name = `Babylonian Chronicles`
  this.color = `red`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a top non-red card with a {k} from your board to my board!`,
    `Draw and score a {3}`
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

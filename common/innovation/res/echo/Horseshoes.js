const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Horseshoes`  // Card names are unique in Innovation
  this.name = `Horseshoes`
  this.color = `red`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `h2&k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {2}.`
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card without a {k} or {f} from your board to my board! If you do, draw and meld a {2}.`
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

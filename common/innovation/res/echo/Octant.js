const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Octant`  // Card names are unique in Innovation
  this.name = `Octant`
  this.color = `red`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top non-red card with a {l} or {f} from your board to my board! If you do, draw and foreshadow a {6}!`,
    `Draw and foreshadow a {6}.`
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

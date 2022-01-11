const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mobility`  // Card names are unique in Innovation
  this.name = `Mobility`
  this.color = `red`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `hfif`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your two highest non-red top cards without a {f} from your board to my score pile! If you transferred any cards, draw an {8}!`
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

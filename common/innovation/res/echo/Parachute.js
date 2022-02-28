const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Parachute`  // Card names are unique in Innovation
  this.name = `Parachute`
  this.color = `red`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `fhii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards with a {i} from your hand to my hand!`
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

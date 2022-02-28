const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Camcorder`  // Card names are unique in Innovation
  this.name = `Camcorder`
  this.color = `red`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `hiif`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards in your hand to my hand! Draw a {9}!`,
    `Meld all {9} from your hand. Return all other cards from your hand. Draw three {9}.`
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

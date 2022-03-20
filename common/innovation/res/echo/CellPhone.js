const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cell Phone`  // Card names are unique in Innovation
  this.name = `Cell Phone`
  this.color = `yellow`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `ihai`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw a {0} for every two {i} on your board.`,
    `You may splay your green cards up.`,
    `You may tuck any number of cards with a {i} from your hand, splaying up each color you tucked into.`
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

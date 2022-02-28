const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `ATM`  // Card names are unique in Innovation
  this.name = `ATM`
  this.color = `yellow`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `ch&9`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw and score a card of any value.`
  this.karma = []
  this.dogma = [
    `I demand you transfer the highest top non-yellow card without a {c} from your board to my board!`,
    `You may splay your purple cards up.`
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

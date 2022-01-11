const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Engineering`  // Card names are unique in Innovation
  this.name = `Engineering`
  this.color = `red`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `khsk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all top cards with a {k} from your board to my score pile!`,
    `You may splay your red cards left.`
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

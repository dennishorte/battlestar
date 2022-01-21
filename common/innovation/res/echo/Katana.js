const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Katana`  // Card names are unique in Innovation
  this.name = `Katana`
  this.color = `red`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two top cards with a {k} from your board to my score pile! If you transferred any, draw a card of value qual to the total number of {k} on those cards and transfer it to my forecast!`
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

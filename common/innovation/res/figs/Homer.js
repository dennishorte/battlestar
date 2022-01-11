const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Homer`  // Card names are unique in Innovation
  this.name = `Homer`
  this.color = `purple`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `h*2k`
  this.dogmaBiscuit = `k`
  this.inspire = `Draw and tuck a {2}.`
  this.echo = ``
  this.karma = [
    `If you would remove or return a figure from your hand, instead tuck it.`
  ]
  this.dogma = []

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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Taiichi Ono`  // Card names are unique in Innovation
  this.name = `Taiichi Ono`
  this.color = `green`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `hii&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw a {0}.`
  this.karma = [
    `If you would take a Dogma action and activate a card, first achieve a card from your hand with featured icon matching that card's featured icon, regardless of eligibility.`
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

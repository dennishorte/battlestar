const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Colonialism`  // Card names are unique in Innovation
  this.name = `Colonialism`
  this.color = `red`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hfsf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck a {3}. If it has a {c}, repeat this dogma effect.`
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

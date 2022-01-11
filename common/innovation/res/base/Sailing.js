const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sailing`  // Card names are unique in Innovation
  this.name = `Sailing`
  this.color = `green`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {1}.`
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

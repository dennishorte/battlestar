const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Puppet`  // Card names are unique in Innovation
  this.name = `Puppet`
  this.color = `purple`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hk3k`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `No effect.`
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

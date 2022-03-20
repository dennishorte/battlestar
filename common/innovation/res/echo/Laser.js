const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Laser`  // Card names are unique in Innovation
  this.name = `Laser`
  this.color = `blue`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `sshl`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all unclaimed standard achievements. Then, return half (rounded up) of the cards in your score pile. Draw and meld two {0}.`
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

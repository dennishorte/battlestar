const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Thermometer`  // Card names are unique in Innovation
  this.name = `Thermometer`
  this.color = `blue`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `h&5s`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld your bottom green card. Maintain its splay.`
  this.karma = []
  this.dogma = [
    `Draw and meld a card of value one higher than the value of your top yellow card. If the melded card is yellow, repeat this dogma effect.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jet`  // Card names are unique in Innovation
  this.name = `Jet`
  this.color = `red`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `h&ia`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Meld a card from your hand.`
  this.karma = []
  this.dogma = [
    `I demand you return your top card of the color I melded due to Jet's echo effect.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stethoscope`  // Card names are unique in Innovation
  this.name = `Stethoscope`
  this.color = `blue`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `s&sh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld a blue or yellow card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw a {7}. If you melded a blue card due to Stethoscope's echo effect, draw an {8}.`,
    `You may splay your yellow cards right.`
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

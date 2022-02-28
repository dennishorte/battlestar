const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rubber`  // Card names are unique in Innovation
  this.name = `Rubber`
  this.color = `red`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `h&f7`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and tuck two {7}.`
  this.karma = []
  this.dogma = [
    `Score a top card from your board without a bonus.`,
    `You may splay your red cards up.`
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

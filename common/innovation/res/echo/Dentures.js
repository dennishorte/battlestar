const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dentures`  // Card names are unique in Innovation
  this.name = `Dentures`
  this.color = `yellow`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `&ffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and tuck a {6}.`
  this.karma = []
  this.dogma = [
    `Score the top two non-bottom cards of the color of the last card you tucked due to Dentures. If there arre non to score, draw and tuck a {6}, then repeat this dogma effect.`,
    `You may splay your blue cards right.`
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

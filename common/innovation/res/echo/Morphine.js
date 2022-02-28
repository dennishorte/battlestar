const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Morphine`  // Card names are unique in Innovation
  this.name = `Morphine`
  this.color = `yellow`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `sh7&`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Score an odd-valued card from your hand.`
  this.karma = []
  this.dogma = [
    `I demand you return all odd-valued cards in your hand! Draw a {6}!`,
    `Draw a card of value on higher than the highest card returned due to the demand, if any were returned.`,
    `You may splay your red cards right.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `George Stephenson`  // Card names are unique in Innovation
  this.name = `George Stephenson`
  this.color = `green`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `7&fh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `You may splay up a color you have splayed right.`
  this.karma = [
    `If you would claim an achievement, first transfer the bottom card from each non-empty age below 10 to the available achievements.`
  ]
  this.dogma = []

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

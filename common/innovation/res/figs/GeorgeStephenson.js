const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `George Stephenson`
  this.color = `green`
  this.age = 7
  this.biscuits = `7&fh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `You may splay up a color you have splayed right.`
  this.triggers = [
    `If you would claim an achievement, first transfer the bottom card from each non-empty age below 10 to the available achievements.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

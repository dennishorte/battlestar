const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Coke`  // Card names are unique in Innovation
  this.name = `Coke`
  this.color = `red`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `&ffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and tuck a {4}.`
  this.karma = []
  this.dogma = [
    `Draw and reveal a {6}. If it has a {f}, meld it and repeat this dogma effect. Otherwise, foreshadow it.`
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

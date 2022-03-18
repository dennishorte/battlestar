const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Battleship Yamato`  // Card names are unique in Innovation
  this.name = `Battleship Yamato`
  this.color = `red`
  this.age = 8
  this.visibleAge = 11
  this.expansion = `arti`
  this.biscuits = `_h__`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
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

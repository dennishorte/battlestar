const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Submarine H. L. Hunley`  // Card names are unique in Innovation
  this.name = `Submarine H. L. Hunley`
  this.color = `red`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to draw and meld a {7}! Reveal the bottom card on your board of the melded card's color! If the revealed card is a {1}, return all cards of its color from your board!`
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

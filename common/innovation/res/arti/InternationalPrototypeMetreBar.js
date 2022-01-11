const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `International Prototype Metre Bar`  // Card names are unique in Innovation
  this.name = `International Prototype Metre Bar`
  this.color = `green`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `chcf`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value. Draw and meld a card of that value. Splay up the color of the melded card. If the number of cards of that color visible on your board is exactly equal to the card's value, you win. Otherwise, return the melded card.`
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

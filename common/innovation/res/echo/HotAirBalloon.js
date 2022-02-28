const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hot Air Balloon`  // Card names are unique in Innovation
  this.name = `Hot Air Balloon`
  this.color = `green`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `s&h7`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw and score a {7}.`
  this.karma = []
  this.dogma = [
    `You may achieve (if eligible) a top card from any other player's board if they have an achievement of matching value. If you do, transfer your top green card to that player's board. Otherwise, draw and meld a {7}.`
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

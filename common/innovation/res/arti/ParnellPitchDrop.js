const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Parnell Pitch Drop`  // Card names are unique in Innovation
  this.name = `Parnell Pitch Drop`
  this.color = `blue`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a card of value one higher than the highest top card on your board. If the melded card has three {i}, you win.`
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

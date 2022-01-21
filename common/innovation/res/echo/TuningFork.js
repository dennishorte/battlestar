const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tuning Fork`  // Card names are unique in Innovation
  this.name = `Tuning Fork`
  this.color = `purple`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `&ssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Look at the top card of any deck, then place it back on top.`
  this.karma = []
  this.dogma = [
    `Return a card from your hand. If you do, draw and reveal a card of the same value, and meld it if it is of higher value than the top card of the same color on your board. Otherwise, return it. You may repeat this dogma effect.`
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

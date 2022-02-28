const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Helicopter`  // Card names are unique in Innovation
  this.name = `Helicopter`
  this.color = `red`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card other than Helicopter from any player's board to its owner's score pile. You may return a card from your hand which shares an icon with the trasnferred card. If you do, repeat this dogma effect.`
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

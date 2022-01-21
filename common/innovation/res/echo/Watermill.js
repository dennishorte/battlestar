const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Watermill`  // Card names are unique in Innovation
  this.name = `Watermill`
  this.color = `yellow`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card with a bonus from your hand. If you do, draw a card of value equal to that card's bonus. If the drawn card also has a bonus, you may return a card from your hand to repeat this dogma effect.`
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

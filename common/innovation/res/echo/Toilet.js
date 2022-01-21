const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Toilet`  // Card names are unique in Innovation
  this.name = `Toilet`
  this.color = `purple`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `&lhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and tuck a {4}.`
  this.karma = []
  this.dogma = [
    `I demand you return all cards from your score pile of value matching the highest bonus on my board!`,
    `You may return a card in your hand and draw a card of the same value.`
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

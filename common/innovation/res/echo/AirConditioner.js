const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Air Conditioner`  // Card names are unique in Innovation
  this.name = `Air Conditioner`
  this.color = `yellow`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `h&9l`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `You may score a card from your hand.`
  this.karma = []
  this.dogma = [
    `I demand you return all cards from your score pile of value matching any of your top cards!`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Maldives`  // Card names are unique in Innovation
  this.name = `Maldives`
  this.color = `red`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return all cards in your hand but two! Return all cards in your score pile but two!`,
    `Return all cards in your score pile but four.`
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

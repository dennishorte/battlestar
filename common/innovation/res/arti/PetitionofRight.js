const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Petition of Right`  // Card names are unique in Innovation
  this.name = `Petition of Right`
  this.color = `blue`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `shcs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a card from your score pile to my score pile for each top card with a {k} on your board.`
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

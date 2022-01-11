const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Roundhay Garden Scene`  // Card names are unique in Innovation
  this.name = `Roundhay Garden Scene`
  this.color = `purple`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld the highest card from your score pile. Draw and score two cards of value equal to the melded card. Execute the effects of the melded card as if they were on this card. Do not share them.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stamp Act`  // Card names are unique in Innovation
  this.name = `Stamp Act`
  this.color = `yellow`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `hcss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a card of value equal to the top yellow card on your board from your score pile to mine! if you do, return a card from your score pile of value equal to the top green card on your board!`
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

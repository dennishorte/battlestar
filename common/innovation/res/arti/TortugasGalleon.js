const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tortugas Galleon`  // Card names are unique in Innovation
  this.name = `Tortugas Galleon`
  this.color = `red`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `ffch`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer all the highest cards from your score pile to my score pile! If you transfered any, transfer a top card on your board of that value to my board.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rosetta Stone`  // Card names are unique in Innovation
  this.name = `Rosetta Stone`
  this.color = `blue`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `kkkh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a card type. Draw two {2} of that type. Meld on and transfer the other to an opponent's board.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sandpaper`  // Card names are unique in Innovation
  this.name = `Sandpaper`
  this.color = `yellow`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `cchl`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. Draw that many {3}, and then meld a card from your hand.`
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

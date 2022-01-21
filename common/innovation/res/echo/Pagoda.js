const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pagoda`  // Card names are unique in Innovation
  this.name = `Pagoda`
  this.color = `purple`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `k2hk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. If you have a card of matching color in your hand, tuck the card from your hand and meld the drawn card. Otherwise, foreshadow the drawn card.`
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

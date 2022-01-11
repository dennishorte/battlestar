const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hunt-Lennox Globe`  // Card names are unique in Innovation
  this.name = `Hunt-Lennox Globe`
  this.color = `green`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you ahve fewer than four cards in your hand, retuan all non-green top cards from your board. Draw a {5} for card returned. Meld a card from your hand.`
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

const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hiking`  // Card names are unique in Innovation
  this.name = `Hiking`
  this.color = `green`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `llhs`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {6}. If the top card on your board of the drawn card's color has {l}, tuck the drawn card and draw and reveal a {5}. If the second drawn card has {l}, meld it and draw an {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
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

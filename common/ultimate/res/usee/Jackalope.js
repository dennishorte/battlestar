const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jackalope`  // Card names are unique in Innovation
  this.name = `Jackalope`
  this.color = `yellow`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `lhll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer the highest card on your board without {l} to my board! If you do, unsplay the transferred card's color on your board!`,
    `Unsplay the color on your board with the most visible cards.`
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

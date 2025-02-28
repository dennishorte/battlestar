const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Escape Room`  // Card names are unique in Innovation
  this.name = `Escape Room`
  this.color = `yellow`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `icih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw, reveal, and score an {11}! Score a card from your hand of the same color as the drawn card! If you don't, you lose!`,
    `Score four top non-yellow cards each with {l} of different colors on your board.`
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

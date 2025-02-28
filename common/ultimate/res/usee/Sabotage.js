const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sabotage`  // Card names are unique in Innovation
  this.name = `Sabotage`
  this.color = `yellow`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw a {6}! Reveal the cards in your hand! Return the card of my choice from your hand! Tuck your top card and all cards from your score pile of the same color as the returned card!`
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

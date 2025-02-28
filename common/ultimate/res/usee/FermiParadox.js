const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fermi Paradox`  // Card names are unique in Innovation
  this.name = `Fermi Paradox`
  this.color = `blue`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal the top card of the {9} deck and the {10} deck. Return the top card of the {9} deck or the {10} deck.`,
    `If you have no cards on your board, you win. Otherwise, transfer all valued cards in the junk to your hand.`
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

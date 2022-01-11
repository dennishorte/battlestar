const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Exxon Valdex`  // Card names are unique in Innovation
  this.name = `Exxon Valdex`
  this.color = `red`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to remove all cards from your hand, score pile, board, and achievements from the game. You lose! If there is only one player remaining in the game, that player wins!`
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

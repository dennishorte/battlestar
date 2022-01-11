const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fission`  // Card names are unique in Innovation
  this.name = `Fission`
  this.color = `red`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you drawa a {0}! If it is red, remove all hands, boards, and score piles from the game! If this occurs, the dogma action is complete.`,
    `Return a top card other than Fission from any player's board. Draw a {0}.`
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

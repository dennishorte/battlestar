const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Plumbing`  // Card names are unique in Innovation
  this.name = `Plumbing`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `&2hk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Score a bottom card from your board.`
  this.karma = []
  this.dogma = [
    `No effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {}
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .utilColors()
      .map(color => game.getBottomCard(player, color))
      .filter(card => card !== undefined)
    game.aChooseAndScore(player, choices)
  }
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

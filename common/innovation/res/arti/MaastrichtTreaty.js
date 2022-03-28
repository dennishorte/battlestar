const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Maastricht Treaty`  // Card names are unique in Innovation
  this.name = `Maastricht Treaty`
  this.color = `green`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have the most cards in your score pile, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const playerCount = game.getCardsByZone(player, 'score').length
      const otherCounts = game
        .getPlayerOpponents(player)
        .map(player => game.getCardsByZone(player, 'score').length)
      const hasMost = otherCounts.every(count => count < playerCount)
      if (hasMost) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.mLogNoEffect()
      }
    }
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

const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Self Service`  // Card names are unique in Innovation
  this.name = `Self Service`
  this.color = `green`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hcpc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have at least twice as many achievements as any other opponent, you win.`,
    `Self-execute any top card other than Self Service on your board.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const mine = game.getAchievementsByPlayer(player).total
      const others = game
        .getPlayerOpponents(player)
        .map(player => game.getAchievementsByPlayer(player).total * 2)

      if (mine > 0 && others.every(count => count <= mine)) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.mLogNoEffect()
      }
    },

    (game, player, { self }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card !== self)
      const card = game.aChooseCard(player, choices)
      if (card) {
        game.aSelfExecute(player, card)
      }
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

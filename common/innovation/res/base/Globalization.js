const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Globalization`  // Card names are unique in Innovation
  this.name = `Globalization`
  this.color = `yellow`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a top card with a {l} from your board!`,
    `Draw and score a {6}.`,
    `If no player has more {l} than {f} on their board, the single player with the most points wins.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(c => c.checkBiscuitIsVisible('l', 'top'))
        .map(c => c.id)
      const card = game.aChooseCard(player, choices)

      if (card) {
        game.aReturn(player, card)
      }
    },

    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 6))
    },

    (game) => {
      const biscuitCounts = Object.values(game.getBiscuits())
      const conditionMet = biscuitCounts
        .filter(({ l, f }) => l > f)
        .length === 0

      if (conditionMet) {
        const playersByScore = game
          .getPlayerAll()
          .map(p => ({ player: p, score: game.getScore(p) }))
          .sort((l, r) => r.score - l.score)

        if (playersByScore[0].score > playersByScore[1].score) {
          throw new GameOverEvent({
            reason: 'Globalization',
            player: playersByScore[0].player
          })
        }
      }
      else {
        game.mLogNoEffect()
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

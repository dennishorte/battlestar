const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Jackie Chan`  // Card names are unique in Innovation
  this.name = `Jackie Chan`
  this.color = `red`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `*iih`
  this.dogmaBiscuit = `i`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `If an opponent would win, first score all other top figures in play. If you now have the most points, you win instead.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'would-win',
      triggerAll: true,
      matches: (game, player, { owner, self }) => {
        return (
          player !== game.getPlayerByCard(self)
          && owner === game.getPlayerByCard(self)
        )
      },
      func: (game, player, { owner, self }) => {
        player = owner
        const topFigures = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.checkIsFigure())
          .filter(card => card !== self)
        game.aScoreMany(player, topFigures, { ordered: true })

        const score = game.getScore(player)
        const others = game
          .getPlayerOpponents(player)
          .map(other => game.getScore(other))
        const mostPointsCondition = others.every(otherScore => otherScore < score)
        if (mostPointsCondition) {
          game.mLog({
            template: '{player} now has the most points',
            args: { player }
          })
          throw new GameOverEvent({
            player,
            reason: this.name
          })
        }
        else {
          game.mLog({
            template: '{player} still does not have the most points',
            args: { player }
          })
        }
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card

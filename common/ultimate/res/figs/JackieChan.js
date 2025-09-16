const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  id: `Jackie Chan`,  // Card names are unique in Innovation
  name: `Jackie Chan`,
  color: `red`,
  age: 10,
  expansion: `figs`,
  biscuits: `*iih`,
  dogmaBiscuit: `i`,
  echo: ``,
  karma: [
    `If an opponent would win, first score all other top figures in play. If you now have the most points, you win instead.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
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


module.exports = {
  id: `Jackie Chan`,  // Card names are unique in Innovation
  name: `Jackie Chan`,
  color: `red`,
  age: 10,
  expansion: `figs`,
  biscuits: `*iih`,
  dogmaBiscuit: `i`,
  karma: [
    `If an opponent would win, first score all other top figures in play. If you now have the most points, you win instead.`
  ],
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
          .players.all()
          .flatMap(player => game.cards.tops(player))
          .filter(card => card.checkIsFigure())
          .filter(card => card !== self)
        game.actions.scoreMany(player, topFigures, { ordered: true })

        const score = game.getScore(player)
        const others = game
          .players.opponents(player)
          .map(other => game.getScore(other))
        const mostPointsCondition = others.every(otherScore => otherScore < score)
        if (mostPointsCondition) {
          game.log.add({
            template: '{player} now has the most points',
            args: { player }
          })
          game.youWin(player, this.name)
        }
        else {
          game.log.add({
            template: '{player} still does not have the most points',
            args: { player }
          })
        }
      }
    }
  ]
}

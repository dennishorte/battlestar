export default {
  id: `Che Guevara`,  // Card names are unique in Innovation
  name: `Che Guevara`,
  color: `yellow`,
  age: 9,
  expansion: `figs`,
  biscuits: `hlpl`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would meld a card, first draw and score a {9}. If the scored card is yellow, junk all cards in all score piles and all available standard achievements.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const drawnCard = game.actions.drawAndScore(player, game.getEffectAge(self, 9))
        if (drawnCard.color === 'yellow') {
          const allScoreCards = game
            .players
            .all()
            .flatMap(player2 => game.cards.byPlayer(player2, 'score'))
          game.actions.junkMany(player, allScoreCards)

          const allAvailableAchievements = game.getAvailableStandardAchievements(player)
          game.actions.junkMany(player, allAvailableAchievements)
        }
      }
    },
  ]
}

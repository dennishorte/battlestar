import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Shelter`,
  color: `yellow`,
  age: 0,
  expansion: `base`,
  biscuits: `hskk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you score a card from your hand! If there are fewer cards in your score pile than in mine, you lose!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'))

      const playerScoreCount = game.cards.byPlayer(player, 'score').length
      const leaderScoreCount = game.cards.byPlayer(leader, 'score').length

      if (playerScoreCount < leaderScoreCount) {
        game.aYouLose(player, self)
      }

    }
  ],
} satisfies AgeCardData

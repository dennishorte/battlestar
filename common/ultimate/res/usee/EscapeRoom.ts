import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Escape Room`,
  color: `yellow`,
  age: 11,
  expansion: `usee`,
  biscuits: `icih`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you draw, reveal, and score an {e}! Score a card from your hand of the same color as the drawn card! If you don't, you lose!`,
    `Score four top non-yellow cards each with {i} of different colors on your board.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 11))
      if (card) {
        game.actions.score(player, card)
        const choices = game
          .cards.byPlayer(player, 'hand')
          .filter(c => c.color === card.color)

        const scored = game.actions.chooseAndScore(player, choices)[0]
        if (!scored) {
          game.aYouLose(player, self)
        }

      }
    },
    (game, player) => {
      const toScore = game
        .cards.tops(player)
        .filter(c => c.color !== 'yellow')
        .filter(c => c.checkHasBiscuit('i'))

      game.actions.scoreMany(player, toScore)
    }
  ],
} satisfies AgeCardData

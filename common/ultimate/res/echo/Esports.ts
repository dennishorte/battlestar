import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Esports`,
  color: `yellow`,
  age: 11,
  expansion: `echo`,
  biscuits: `tphp`,
  dogmaBiscuit: `p`,
  dogma: [
    `For each non-yellow top card on your board, draw and score a card of equal value, in ascending order. If you do, and Esports was foreseen, you win.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      const topAges = game
        .cards
        .tops(player)
        .filter(card => card.color !== 'yellow')
        .map(card => card.age)
        .sort((l, r) => l - r)

      for (const age of topAges) {
        game.actions.drawAndScore(player, age)
      }

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        game.youWin(player, 'Esports')
      }
    }
  ],
} satisfies AgeCardData

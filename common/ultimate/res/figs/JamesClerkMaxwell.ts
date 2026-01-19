import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `James Clerk Maxwell`,  // Card names are unique in Innovation
  name: `James Clerk Maxwell`,
  color: `blue`,
  age: 7,
  expansion: `figs`,
  biscuits: `hp7i`,
  dogmaBiscuit: `i`,
  karma: [
    `Each card in your hand provides one additional standard icon of every type on your board.`,
    `If a player would return a card of value lower than 8, first draw an {8}.`,
  ],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const bonus = game.cards.byPlayer(player, 'hand').length
        const output = game.util.emptyBiscuits()
        for (const biscuit of Object.keys(biscuits)) {
          if (biscuits[biscuit] > 0) {
            output[biscuit] = bonus
          }

        }
        return output
      }
    },
    {
      trigger: 'return',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { card }) => card.getAge() < 8,
      func: (game, player, { owner, self }) => {
        game.actions.draw(owner, { age: game.getEffectAge(self, 8) })
      },
    }
  ]
} satisfies AgeCardData

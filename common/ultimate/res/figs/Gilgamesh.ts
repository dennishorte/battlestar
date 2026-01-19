import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Gilgamesh`,  // Card names are unique in Innovation
  name: `Gilgamesh`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `ph1k`,
  dogmaBiscuit: `k`,
  karma: [
    `Each {k} on your board provides one additional {k} and one additional {f}`,
    `Each {k} on an opponent's board subtracts one point from that opponent's score`,
  ],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const output = game.util.emptyBiscuits()
        output.k = biscuits.k
        output.f = biscuits.k
        return output
      }

    },

    {
      trigger: 'calculate-score',
      triggerAll: true,
      func: (game, player, { self }) => {
        if (player.id === self.owner.id) {
          return 0
        }
        else {
          return -player.biscuits().k
        }
      }
    },
  ]
} satisfies AgeCardData
